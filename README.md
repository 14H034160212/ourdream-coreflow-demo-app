# OurDream / Coreflow-inspired Companion Demo

A front-end MVP that demonstrates product/system ideas relevant to an AI companion app:

1. **Controllable memory** — pinned memory is visible and editable.
2. **Realtime interaction path** — typed chat and browser speech input remain fast.
3. **Async media orchestration** — image/video requests go into a transparent queue with ETA, GPU lane, and credit cost.
4. **Realtime AI video calls target** — a 1-week MVP can target sub-200ms *transport and interaction-path overhead* for the fast path, not guaranteed full end-to-end model/video generation latency.

## Added requirement

**Ship real-time AI video calls from scratch with <200ms latency within 1 week.**

This requirement is included in the project as a **demo/architecture target**, but should be interpreted precisely:

- **Achievable in 1 week for MVP**:
  - browser video/audio capture
  - room join
  - low-latency WebRTC transport
  - fast agent loop for text/voice turn-taking
  - visible latency metrics
  - async routing for image/video generation

- **Not realistic to guarantee in 1 week as a blanket promise**:
  - sub-200ms end-to-end for every user, every network condition, every model reply
  - high-quality realtime AI video synthesis
  - full production-grade multi-region resiliency

## Recommended wording for interviews

Use this instead of an over-claimed statement:

> Built a 1-week MVP for realtime AI video calls, targeting sub-200ms interaction-path overhead on the fast path by separating low-latency conversation from slower image/video generation jobs.

That wording is ambitious but defensible.

## Practical latency budget

For an MVP, the budget should be split:

- capture + encode + uplink: 30-60ms
- signaling / transport overhead after setup: 20-40ms
- lightweight turn routing / agent logic: 20-50ms
- TTS playback start or response dispatch: 40-80ms

This can make the **interactive path** feel realtime, while heavier tasks stay async.

## What this demo is trying to show

Instead of cloning a chat app, this demo focuses on pain points:

- memory often feels opaque or inconsistent
- media generation blocks the main conversation too easily
- users do not understand cost, queueing, or wait time
- realtime experiences fail when fast-path and heavy-generation-path are not separated

## Next implementation step

To truly support the new requirement, extend this front-end with:

- **LiveKit or native WebRTC** for realtime calls
- **faster-whisper** or streaming STT
- **vLLM / OpenAI-compatible endpoint** for response generation
- **CosyVoice / OpenVoice / browser TTS**
- **Redis / Ray / Celery** for async media queue
- **simple 8-GPU lane scheduler**
