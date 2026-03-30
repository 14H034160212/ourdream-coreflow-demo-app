const STORAGE_KEYS = {
  memory: "companion_demo_memory",
  jobs: "companion_demo_jobs",
  credits: "companion_demo_credits",
};

const defaultMemory = [
  { id: makeId(), text: "User values consistency and wants memory to be explainable.", source: "system" },
  { id: makeId(), text: "User likes emotionally warm but low-drama companions.", source: "starter pack" },
];

const state = {
  persona: "Neon Dreamer",
  tone: "warm",
  speaking: true,
  recognition: null,
  listening: false,
  memory: loadJson(STORAGE_KEYS.memory, defaultMemory),
  jobs: loadJson(STORAGE_KEYS.jobs, []),
  creditsUsed: Number(localStorage.getItem(STORAGE_KEYS.credits) || "0"),
};

const el = {
  personaSelect: document.getElementById("personaSelect"),
  toneSelect: document.getElementById("toneSelect"),
  chatLog: document.getElementById("chatLog"),
  composer: document.getElementById("composer"),
  messageInput: document.getElementById("messageInput"),
  memoryList: document.getElementById("memoryList"),
  jobList: document.getElementById("jobList"),
  replyLatency: document.getElementById("replyLatency"),
  voiceLatency: document.getElementById("voiceLatency"),
  creditsUsed: document.getElementById("creditsUsed"),
  realtimeStatus: document.getElementById("realtimeStatus"),
  queueStatus: document.getElementById("queueStatus"),
  addMemoryBtn: document.getElementById("addMemoryBtn"),
  clearJobsBtn: document.getElementById("clearJobsBtn"),
  memoryDialog: document.getElementById("memoryDialog"),
  memoryInput: document.getElementById("memoryInput"),
  saveMemoryBtn: document.getElementById("saveMemoryBtn"),
  voiceBtn: document.getElementById("voiceBtn"),
  speakBtn: document.getElementById("speakBtn"),
};

init();

function init() {
  el.personaSelect.value = state.persona;
  el.toneSelect.value = state.tone;
  bindEvents();
  renderMemory();
  renderJobs();
  updateCredits();
  seedChat();
  setupSpeechRecognition();
  tickJobScheduler();
}

function bindEvents() {
  el.personaSelect.addEventListener("change", (e) => state.persona = e.target.value);
  el.toneSelect.addEventListener("change", (e) => state.tone = e.target.value);

  el.composer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = el.messageInput.value.trim();
    if (!text) return;
    el.messageInput.value = "";
    await handleUserMessage(text, { viaVoice: false });
  });

  el.addMemoryBtn.addEventListener("click", () => {
    el.memoryInput.value = "";
    el.memoryDialog.showModal();
  });

  el.saveMemoryBtn.addEventListener("click", () => {
    const text = el.memoryInput.value.trim();
    if (!text) return;
    addMemory(text, "manual");
    renderMemory();
  });

  el.clearJobsBtn.addEventListener("click", () => {
    state.jobs = [];
    persistJobs();
    renderJobs();
  });

  el.voiceBtn.addEventListener("click", toggleVoiceInput);
  el.speakBtn.addEventListener("click", () => {
    state.speaking = !state.speaking;
    el.speakBtn.textContent = state.speaking ? "🔊 Voice Reply On" : "🔇 Voice Reply Off";
  });
}

function seedChat() {
  pushMessage("system", "This demo makes memory and media orchestration visible. Ask for a photo or video to see async routing, or say ‘remember ...’ to pin memory.");
  pushMessage("bot", state.persona + " is online. I will reply quickly in chat, but long-running image/video tasks go to a visible queue instead of blocking the conversation.");
}

async function handleUserMessage(text, opts) {
  const viaVoice = opts && opts.viaVoice;
  const startedAt = performance.now();
  pushMessage("user", text, viaVoice ? "voice input" : "typed input");

  maybeExtractMemory(text);
  const plan = planIntent(text);

  if (plan.memories.length) {
    plan.memories.forEach((m) => addMemory(m, "auto"));
    renderMemory();
    pushMessage("system", "Pinned " + plan.memories.length + " memory item(s) so the user can inspect and edit what the companion will rely on.");
  }

  if (plan.mediaJobs.length) {
    plan.mediaJobs.forEach(enqueueJob);
    renderJobs();
    pushMessage("system", "Routed " + plan.mediaJobs.length + " long-running media task(s) to the async queue so realtime conversation stays responsive.");
  }

  const reply = generateCompanionReply(text, plan);
  const delay = 180 + Math.round(Math.random() * 260);
  await sleep(delay);
  const elapsed = performance.now() - startedAt;
  el.replyLatency.textContent = Math.round(elapsed) + " ms";
  el.realtimeStatus.textContent = elapsed < 500 ? "healthy" : "degraded";
  pushMessage("bot", reply, buildReplyMeta(plan));
  if (state.speaking) speak(reply);

  if (viaVoice) {
    el.voiceLatency.textContent = Math.round(elapsed + 120) + " ms";
  }
}

function planIntent(text) {
  const normalized = text.toLowerCase();
  const memories = [];
  const mediaJobs = [];

  if (normalized.includes("remember ")) {
    const remembered = text.slice(normalized.indexOf("remember ") + "remember ".length).trim();
    if (remembered) memories.push(capitalize(remembered.replace(/^that\s+/i, "")));
  }

  if (/(selfie|photo|picture|image|portrait)/i.test(text)) {
    mediaJobs.push(createJob("image", text, 25, "gpu 2-5", 18));
  }
  if (/(video|clip|walking|kiss|dance|hug)/i.test(text)) {
    mediaJobs.push(createJob("video", text, 120, "gpu 6-7", 60));
  }

  return { memories, mediaJobs };
}

function maybeExtractMemory(text) {
  const normalized = text.toLowerCase();
  const pattern = /i like ([^.,!?]+)/i;
  const match = text.match(pattern);
  if (match && !normalized.includes("show me")) {
    addMemory("User likes " + match[1].trim() + ".", "auto");
    renderMemory();
  }
}

function createJob(type, prompt, etaSeconds, lane, credits) {
  return {
    id: makeId(),
    type,
    prompt,
    etaSeconds,
    lane,
    credits,
    status: "queued",
    progress: 0,
    createdAt: new Date().toISOString(),
  };
}

function enqueueJob(job) {
  state.jobs.unshift(job);
  state.creditsUsed += job.credits;
  persistJobs();
  updateCredits();
}

function tickJobScheduler() {
  setInterval(() => {
    let changed = false;
    const activeJobs = state.jobs.filter((job) => job.status !== "done");
    activeJobs.forEach((job, idx) => {
      if (job.status === "queued") {
        job.status = idx === 0 ? "running" : "queued";
        changed = true;
      } else if (job.status === "running") {
        const step = job.type === "video" ? 8 : 22;
        job.progress = Math.min(100, job.progress + step);
        job.etaSeconds = Math.max(0, job.etaSeconds - (job.type === "video" ? 12 : 5));
        changed = true;
        if (job.progress >= 100) {
          job.status = "done";
        }
      }
    });
    if (changed) {
      persistJobs();
      renderJobs();
    }
  }, 1800);
}

function generateCompanionReply(text, plan) {
  const memoryHints = state.memory.slice(0, 3).map((m) => m.text).join(" | ");
  const toneMap = {
    warm: "gentle and reassuring",
    playful: "teasing and light",
    intimate: "close and emotionally attentive",
    mysterious: "poetic and a little enigmatic",
  };
  const toneSnippet = toneMap[state.tone] || "warm";

  if (plan.mediaJobs.length) {
    return "I can stay present with you while the " + plan.mediaJobs.map(j => j.type).join(" and ") + " request runs in the background. I kept the fast path for conversation and sent the heavy media work to " + plan.mediaJobs.map(j => j.lane).join(", ") + ".";
  }

  if (/memory|remember/i.test(text)) {
    return "I pinned that intentionally instead of hiding it in a black box. Right now I am grounding on: " + memoryHints + ".";
  }

  return state.persona + " speaking in a " + toneSnippet + " tone: I heard you say ‘" + truncate(text, 90) + "’. I would answer quickly first, then only escalate to a heavier model or media workflow if needed.";
}

function buildReplyMeta(plan) {
  const tags = [];
  if (plan.memories.length) tags.push("memory updated");
  if (plan.mediaJobs.length) tags.push("async media routed");
  if (!tags.length) tags.push("realtime path");
  return tags.join(" · ");
}

function pushMessage(role, text, meta) {
  const wrapper = document.createElement("div");
  wrapper.className = "message " + role;
  wrapper.innerHTML = (meta ? "<small>" + escapeHtml(meta) + "</small>" : "") + "<div>" + escapeHtml(text).replace(/\n/g, "<br>") + "</div>";
  el.chatLog.appendChild(wrapper);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

function renderMemory() {
  persistMemory();
  el.memoryList.innerHTML = "";
  if (!state.memory.length) {
    el.memoryList.innerHTML = '<p class="hint">No memory pinned yet.</p>';
    return;
  }
  state.memory.forEach((item) => {
    const row = document.createElement("div");
    row.className = "memory-item";
    row.innerHTML = '<p>' + escapeHtml(item.text) + '</p><div class="memory-meta"><span class="badge accent">' + escapeHtml(item.source) + '</span><button class="ghost-btn" data-memory-id="' + item.id + '">Delete</button></div>';
    row.querySelector("button").addEventListener("click", () => {
      state.memory = state.memory.filter((m) => m.id !== item.id);
      renderMemory();
    });
    el.memoryList.appendChild(row);
  });
}

function renderJobs() {
  el.jobList.innerHTML = "";
  const active = state.jobs.filter((job) => job.status !== "done").length;
  el.queueStatus.textContent = active ? active + " active" : "idle";

  if (!state.jobs.length) {
    el.jobList.innerHTML = '<p class="hint">No queued media jobs.</p>';
    return;
  }

  state.jobs.forEach((job) => {
    const badgeClass = job.status === "done" ? "ok" : job.status === "running" ? "accent" : "warn";
    const row = document.createElement("div");
    row.className = "job-item";
    row.innerHTML = '<p><strong>' + job.type.toUpperCase() + '</strong> — ' + escapeHtml(truncate(job.prompt, 70)) + '</p>' +
      '<div class="job-meta"><span class="badge ' + badgeClass + '">' + job.status + '</span><span>' + job.lane + '</span><span>' + job.credits + ' credits</span></div>' +
      '<div class="job-meta"><span>ETA ' + job.etaSeconds + 's</span><span>' + job.progress + '%</span></div>';
    el.jobList.appendChild(row);
  });
}

function addMemory(text, source) {
  if (!text) return;
  const normalized = text.toLowerCase();
  if (state.memory.some((m) => m.text.toLowerCase() === normalized)) return;
  state.memory.unshift({ id: makeId(), text, source });
  persistMemory();
}

function persistMemory() {
  localStorage.setItem(STORAGE_KEYS.memory, JSON.stringify(state.memory));
}

function persistJobs() {
  localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(state.jobs));
}

function updateCredits() {
  localStorage.setItem(STORAGE_KEYS.credits, String(state.creditsUsed));
  el.creditsUsed.textContent = state.creditsUsed;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    el.voiceBtn.disabled = true;
    el.voiceBtn.textContent = "🎙 Voice Unsupported";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    state.listening = false;
    el.voiceBtn.textContent = "🎙 Start Voice";
    await handleUserMessage(transcript, { viaVoice: true });
  };
  recognition.onend = () => {
    state.listening = false;
    el.voiceBtn.textContent = "🎙 Start Voice";
  };
  recognition.onerror = () => {
    state.listening = false;
    el.voiceBtn.textContent = "🎙 Start Voice";
  };
  state.recognition = recognition;
}

function toggleVoiceInput() {
  if (!state.recognition) return;
  if (state.listening) {
    state.recognition.stop();
    state.listening = false;
    el.voiceBtn.textContent = "🎙 Start Voice";
    return;
  }
  state.recognition.start();
  state.listening = true;
  el.voiceBtn.textContent = "🛑 Stop Voice";
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.03;
  utterance.pitch = 1.02;
  window.speechSynthesis.speak(utterance);
}

function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}
