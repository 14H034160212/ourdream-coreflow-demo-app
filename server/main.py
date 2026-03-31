"""
Companion OS — Image Generation Backend
========================================
FastAPI server that runs Stable Diffusion locally and serves the
front-end demo as static files from the parent directory.

Usage:
  pip install -r requirements.txt
  python main.py                          # port 8100 by default
  python main.py --port 8100 --preload runwayml/stable-diffusion-v1-5
"""

import argparse
import asyncio
import base64
import io
import os
import threading
import uuid
from datetime import datetime
from typing import Optional

import torch
import uvicorn
from diffusers import (
    DPMSolverMultistepScheduler,
    StableDiffusionPipeline,
    StableDiffusionXLPipeline,
)
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(title="Companion OS Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Device / dtype ───────────────────────────────────────────────────────────

DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "mps"
    if (hasattr(torch.backends, "mps") and torch.backends.mps.is_available())
    else "cpu"
)
DTYPE = torch.float16 if DEVICE in ("cuda", "mps") else torch.float32

# ─── Global pipeline state ────────────────────────────────────────────────────

_pipeline = None
_pipeline_model_id: Optional[str] = None
_pipeline_lock = threading.Lock()
_jobs: dict = {}

# ─── Supported models ─────────────────────────────────────────────────────────

RECOMMENDED_MODELS = [
    {
        "id": "runwayml/stable-diffusion-v1-5",
        "label": "SD 1.5 — General purpose (4 GB VRAM)",
        "is_xl": False,
        "default": True,
    },
    {
        "id": "SG161222/Realistic_Vision_V6.0_B1_noVAE",
        "label": "Realistic Vision 6 — Photorealistic portrait (4 GB VRAM)",
        "is_xl": False,
    },
    {
        "id": "Lykon/dreamshaper-8",
        "label": "DreamShaper 8 — Semi-realistic / fantasy (4 GB VRAM)",
        "is_xl": False,
    },
    {
        "id": "stabilityai/stable-diffusion-xl-base-1.0",
        "label": "SDXL Base — Highest quality (8 GB VRAM)",
        "is_xl": True,
    },
]

# ─── Persona → visual style mapping ──────────────────────────────────────────

PERSONA_VISUAL = {
    "neon dreamer": (
        "cyberpunk aesthetic, neon-dyed hair, holographic accessories, "
        "neon city lights bokeh background, futuristic streetwear"
    ),
    "calm architect": (
        "professional and minimalist appearance, warm soft natural lighting, "
        "clean indoor background, neutral tones"
    ),
    "moonlit traveler": (
        "dark wavy hair, moonlit forest clearing background, "
        "fantasy aesthetic, ethereal soft glow, mysterious atmosphere"
    ),
}

QUALITY_TAGS = "highly detailed face, sharp focus, 4k, best quality, masterpiece, photorealistic"
NEGATIVE_DEFAULT = (
    "blurry, bad quality, deformed, ugly, disfigured, extra limbs, "
    "mutated, bad anatomy, lowres, text, watermark, logo, cropped"
)

# ─── Schemas ──────────────────────────────────────────────────────────────────


class ImageGenRequest(BaseModel):
    prompt: str
    negative_prompt: str = NEGATIVE_DEFAULT
    model_id: str = "runwayml/stable-diffusion-v1-5"
    steps: int = Field(default=25, ge=5, le=60)
    guidance_scale: float = Field(default=7.5, ge=1.0, le=20.0)
    width: int = Field(default=512, ge=256, le=1024)
    height: int = Field(default=512, ge=256, le=1024)
    persona: str = ""


class LoadModelRequest(BaseModel):
    model_id: str


# ─── Pipeline helpers ─────────────────────────────────────────────────────────


def _is_xl(model_id: str) -> bool:
    return any(x in model_id.lower() for x in ("xl", "sdxl"))


def _load_pipeline(model_id: str):
    global _pipeline, _pipeline_model_id
    with _pipeline_lock:
        if _pipeline is not None and _pipeline_model_id == model_id:
            return _pipeline

        print(f"[INFO] Loading {model_id} → {DEVICE} ({DTYPE}) ...")

        cls = StableDiffusionXLPipeline if _is_xl(model_id) else StableDiffusionPipeline
        pipe = cls.from_pretrained(
            model_id,
            torch_dtype=DTYPE,
            use_safetensors=True,
            safety_checker=None,
            requires_safety_checker=False,
        )
        pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
        pipe = pipe.to(DEVICE)

        if DEVICE == "cuda":
            pipe.enable_attention_slicing()
            try:
                pipe.enable_xformers_memory_efficient_attention()
            except Exception:
                pass

        _pipeline = pipe
        _pipeline_model_id = model_id
        print(f"[INFO] Model ready: {model_id}")
        return pipe


def _build_prompt(req: ImageGenRequest) -> str:
    """Enrich the user prompt with persona-specific visual style and quality tags."""
    persona_hint = PERSONA_VISUAL.get(req.persona.lower().strip(), "")

    base = req.prompt.strip()
    if not any(w in base.lower() for w in ["portrait", "photo", "selfie", "picture of", "image of"]):
        base = "portrait of a young woman, " + base

    parts = [p for p in [base, persona_hint, QUALITY_TAGS] if p]
    return ", ".join(parts)


# ─── Routes ───────────────────────────────────────────────────────────────────


@app.get("/health")
def health():
    return {
        "ok": True,
        "device": DEVICE,
        "dtype": str(DTYPE),
        "model_loaded": _pipeline_model_id,
        "active_jobs": sum(1 for j in _jobs.values() if j["status"] in ("queued", "running")),
        "total_jobs": len(_jobs),
    }


@app.get("/api/models")
def list_models():
    return {"models": RECOMMENDED_MODELS}


@app.post("/api/load")
async def load_model(req: LoadModelRequest):
    """Pre-warm the pipeline in a background thread."""
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _load_pipeline, req.model_id)
    return {"ok": True, "model_id": req.model_id, "device": DEVICE}


@app.post("/api/generate/image")
async def generate_image(req: ImageGenRequest, background_tasks: BackgroundTasks):
    """Submit an image generation job. Returns job_id immediately."""
    job_id = str(uuid.uuid4())
    _jobs[job_id] = {
        "id": job_id,
        "type": "image",
        "status": "queued",
        "progress": 0,
        "prompt": req.prompt,
        "model_id": req.model_id,
        "result_b64": None,
        "error": None,
        "created_at": datetime.utcnow().isoformat(),
    }
    background_tasks.add_task(_run_gen, job_id, req)
    return {"job_id": job_id, "status": "queued"}


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    # Omit large base64 payload until the job is done
    if job["status"] != "done":
        return {k: v for k, v in job.items() if k != "result_b64"}
    return job


@app.get("/api/jobs")
def list_jobs():
    summary = [{k: v for k, v in j.items() if k != "result_b64"} for j in _jobs.values()]
    return {"jobs": summary}


# ─── Background generation ────────────────────────────────────────────────────


async def _run_gen(job_id: str, req: ImageGenRequest):
    job = _jobs[job_id]
    try:
        job["status"] = "running"
        job["progress"] = 5
        loop = asyncio.get_event_loop()
        img_bytes = await loop.run_in_executor(None, _gen_sync, req, job)
        job["result_b64"] = "data:image/png;base64," + base64.b64encode(img_bytes).decode()
        job["status"] = "done"
        job["progress"] = 100
        print(f"[INFO] Job {job_id[:8]}… done")
    except Exception as exc:
        job["status"] = "error"
        job["error"] = str(exc)
        print(f"[ERROR] Job {job_id[:8]}… failed: {exc}")


def _gen_sync(req: ImageGenRequest, job: dict) -> bytes:
    pipe = _load_pipeline(req.model_id)
    prompt = _build_prompt(req)
    print(f"[GEN] {prompt[:100]}…")

    total_steps = req.steps

    def on_step_end(pipe, step_index, timestep, callback_kwargs):
        job["progress"] = 5 + int((step_index / total_steps) * 90)
        return callback_kwargs

    # Try new-style callback first (diffusers >= 0.26), fall back to old style
    try:
        result = pipe(
            prompt=prompt,
            negative_prompt=req.negative_prompt,
            num_inference_steps=req.steps,
            guidance_scale=req.guidance_scale,
            width=req.width,
            height=req.height,
            callback_on_step_end=on_step_end,
            callback_on_step_end_tensor_inputs=["latents"],
        )
    except TypeError:
        def old_callback(step, timestep, latents):
            job["progress"] = 5 + int((step / total_steps) * 90)

        result = pipe(
            prompt=prompt,
            negative_prompt=req.negative_prompt,
            num_inference_steps=req.steps,
            guidance_scale=req.guidance_scale,
            width=req.width,
            height=req.height,
            callback=old_callback,
            callback_steps=1,
        )

    buf = io.BytesIO()
    result.images[0].save(buf, format="PNG")
    return buf.getvalue()


# ─── Static file serving ──────────────────────────────────────────────────────
# Mount the parent directory so the front-end is accessible at http://localhost:8100

_frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app.mount("/", StaticFiles(directory=_frontend_dir, html=True), name="frontend")


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Companion OS Image Backend")
    parser.add_argument("--host", default="0.0.0.0", help="Bind host")
    parser.add_argument("--port", type=int, default=8100, help="Bind port")
    parser.add_argument("--preload", default="", help="Model ID to warm-up on startup")
    args = parser.parse_args()

    if args.preload:
        print(f"[INFO] Pre-loading {args.preload} ...")
        _load_pipeline(args.preload)

    print(f"[INFO] Starting on http://{args.host}:{args.port}  (device={DEVICE})")
    uvicorn.run(app, host=args.host, port=args.port)
