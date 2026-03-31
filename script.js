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
  msgCount: 0,
  sessionStart: Date.now(),
  inCall: false,
  callInterval: null,
  callTick: 0,
  archOpen: true,
};

const el = {
  personaSelect: document.getElementById("personaSelect"),
  toneSelect: document.getElementById("toneSelect"),
  chatLog: document.getElementById("chatLog"),
  composer: document.getElementById("composer"),
  messageInput: document.getElementById("messageInput"),
  memoryList: document.getElementById("memoryList"),
  memorySearchInput: document.getElementById("memorySearchInput"),
  jobList: document.getElementById("jobList"),
  replyLatency: document.getElementById("replyLatency"),
  voiceLatency: document.getElementById("voiceLatency"),
  creditsUsed: document.getElementById("creditsUsed"),
  realtimeStatus: document.getElementById("realtimeStatus"),
  queueStatus: document.getElementById("queueStatus"),
  msgCount: document.getElementById("msgCount"),
  sessionTimer: document.getElementById("sessionTimer"),
  addMemoryBtn: document.getElementById("addMemoryBtn"),
  clearJobsBtn: document.getElementById("clearJobsBtn"),
  memoryDialog: document.getElementById("memoryDialog"),
  memoryInput: document.getElementById("memoryInput"),
  saveMemoryBtn: document.getElementById("saveMemoryBtn"),
  voiceBtn: document.getElementById("voiceBtn"),
  speakBtn: document.getElementById("speakBtn"),
  videoCallBtn: document.getElementById("videoCallBtn"),
  quickChips: document.getElementById("quickChips"),
  toastContainer: document.getElementById("toastContainer"),
  // latency breakdown
  latencyBreakdown: document.getElementById("latencyBreakdown"),
  lbCapture: document.getElementById("lbCapture"),
  lbTransport: document.getElementById("lbTransport"),
  lbAgent: document.getElementById("lbAgent"),
  lbTts: document.getElementById("lbTts"),
  lbCaptureMs: document.getElementById("lbCaptureMs"),
  lbTransportMs: document.getElementById("lbTransportMs"),
  lbAgentMs: document.getElementById("lbAgentMs"),
  lbTtsMs: document.getElementById("lbTtsMs"),
  lbTotal: document.getElementById("lbTotal"),
  // video call
  videoCallOverlay: document.getElementById("videoCallOverlay"),
  vcPersonaName: document.getElementById("vcPersonaName"),
  vcStatus: document.getElementById("vcStatus"),
  vcLatencyBadge: document.getElementById("vcLatencyBadge"),
  vcAvatarInner: document.getElementById("vcAvatarInner"),
  vcWaveform: document.getElementById("vcWaveform"),
  vcLocalWaveform: document.getElementById("vcLocalWaveform"),
  vcCaption: document.getElementById("vcCaption"),
  vcTransport: document.getElementById("vcTransport"),
  vcAgentLoop: document.getElementById("vcAgentLoop"),
  vcTtsStart: document.getElementById("vcTtsStart"),
  vcRoundTrip: document.getElementById("vcRoundTrip"),
  vcMuteBtn: document.getElementById("vcMuteBtn"),
  vcEndBtn: document.getElementById("vcEndBtn"),
  vcCaptureBtn: document.getElementById("vcCaptureBtn"),
  vcTranscriptLog: document.getElementById("vcTranscriptLog"),
  // architecture strip
  archToggle: document.getElementById("archToggle"),
  archBody: document.getElementById("archBody"),
  archChevron: document.getElementById("archChevron"),
};

init();

function init() {
  el.personaSelect.value = state.persona;
  el.toneSelect.value = state.tone;
  bindEvents();
  bindArchToggle();
  renderMemory();
  renderJobs();
  updateCredits();
  seedChat();
  setupSpeechRecognition();
  tickJobScheduler();
  tickSession();
}

function bindEvents() {
  el.personaSelect.addEventListener("change", (e) => {
    state.persona = e.target.value;
    el.vcPersonaName.textContent = state.persona;
    updateAvatarSymbol();
  });
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

  el.videoCallBtn.addEventListener("click", toggleVideoCall);

  // Quick action chips
  el.quickChips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", async () => {
      const prompt = chip.dataset.prompt;
      if (!prompt) return;
      el.messageInput.value = "";
      await handleUserMessage(prompt, { viaVoice: false });
    });
  });

  // Memory search
  el.memorySearchInput.addEventListener("input", () => renderMemory());

  // Video call controls
  el.vcMuteBtn.addEventListener("click", () => {
    const muted = el.vcMuteBtn.textContent.includes("Mute");
    el.vcMuteBtn.textContent = muted ? "🎙 Unmute" : "🎙 Mute";
    el.vcLocalWaveform.classList.toggle("muted", muted);
  });
  el.vcEndBtn.addEventListener("click", () => endVideoCall());
  el.vcCaptureBtn.addEventListener("click", () => {
    const job = createJob("image", "In-call capture for " + state.persona, 25, "gpu 2-5", 18);
    enqueueJob(job);
    renderJobs();
    showVcCaption("📸 Capture sent to async queue → gpu 2-5");
    appendVcTranscript("System", "📸 Capture queued → gpu 2-5");
  });
}

function bindArchToggle() {
  if (!el.archToggle) return;
  el.archToggle.addEventListener("click", () => {
    state.archOpen = !state.archOpen;
    el.archBody.classList.toggle("arch-collapsed", !state.archOpen);
    el.archChevron.textContent = state.archOpen ? "▼" : "▶";
  });
}

function seedChat() {
  pushMessage("system", "This demo makes memory and media orchestration visible. Ask for a photo or video to see async routing, or say 'remember ...' to pin memory.");
  pushMessage("bot", state.persona + " is online. I will reply quickly in chat, but long-running image/video tasks go to a visible queue instead of blocking the conversation.");
}

async function handleUserMessage(text, opts) {
  const viaVoice = opts && opts.viaVoice;
  const startedAt = performance.now();
  pushMessage("user", text, viaVoice ? "voice input" : "typed input");
  state.msgCount++;
  el.msgCount.textContent = state.msgCount;

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

  showTypingIndicator();

  const delay = 180 + Math.round(Math.random() * 260);
  await sleep(delay);

  const elapsed = performance.now() - startedAt;
  hideTypingIndicator();

  el.replyLatency.textContent = Math.round(elapsed) + " ms";
  el.realtimeStatus.textContent = elapsed < 500 ? "healthy" : "degraded";

  const reply = generateCompanionReply(text, plan);
  pushMessage("bot", reply, buildReplyMeta(plan));
  if (state.speaking) speak(reply);

  if (viaVoice) {
    el.voiceLatency.textContent = Math.round(elapsed + 120) + " ms";
  }

  updateLatencyBreakdown(elapsed);
}

function showTypingIndicator() {
  if (document.getElementById("typingIndicator")) return;
  const indicator = document.createElement("div");
  indicator.id = "typingIndicator";
  indicator.className = "message bot typing-indicator";
  indicator.innerHTML = '<span></span><span></span><span></span>';
  el.chatLog.appendChild(indicator);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

function updateLatencyBreakdown(totalMs) {
  const capture   = 35 + Math.round(Math.random() * 25);
  const transport = 25 + Math.round(Math.random() * 20);
  const agent     = Math.max(10, Math.round(totalMs * 0.45));
  const tts       = Math.max(10, Math.round(totalMs - capture - transport - agent));

  const maxMs = 200;
  const pct = (ms) => Math.min(100, Math.round((ms / maxMs) * 100)) + "%";

  el.lbCapture.style.width   = pct(capture);
  el.lbTransport.style.width = pct(transport);
  el.lbAgent.style.width     = pct(agent);
  el.lbTts.style.width       = pct(tts);

  el.lbCaptureMs.textContent   = capture + " ms";
  el.lbTransportMs.textContent = transport + " ms";
  el.lbAgentMs.textContent     = agent + " ms";
  el.lbTtsMs.textContent       = tts + " ms";

  const total = capture + transport + agent + tts;
  el.lbTotal.textContent = total + " ms";
  el.lbTotal.style.color = total < 200 ? "var(--ok)" : "var(--warn)";

  el.latencyBreakdown.classList.remove("hidden");
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
  const pattern = /i like ([^.,!?]+)/i;
  const match = text.match(pattern);
  const normalized = text.toLowerCase();
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
        if (idx === 0) { job.status = "running"; changed = true; }
      } else if (job.status === "running") {
        const step = job.type === "video" ? 8 : 22;
        job.progress = Math.min(100, job.progress + step);
        job.etaSeconds = Math.max(0, job.etaSeconds - (job.type === "video" ? 12 : 5));
        changed = true;
        if (job.progress >= 100) {
          job.status = "done";
          onJobDone(job);
        }
      }
    });
    if (changed) {
      persistJobs();
      renderJobs();
    }
  }, 1800);
}

function onJobDone(job) {
  const label = job.type === "image" ? "Image ready" : "Video ready";
  showToast(label + " — " + truncate(job.prompt, 48), "ok");
  pushMediaResultCard(job);
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = "toast toast-" + (type || "ok");
  toast.innerHTML =
    '<span class="toast-icon">' + (type === "ok" ? "✅" : type === "warn" ? "⚠️" : "ℹ️") + '</span>' +
    '<span class="toast-msg">' + escapeHtml(message) + '</span>' +
    '<button class="toast-close" aria-label="dismiss">✕</button>';

  toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));
  el.toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  // Auto-dismiss after 4.5s
  setTimeout(() => dismissToast(toast), 4500);
}

function dismissToast(toast) {
  toast.classList.remove("toast-visible");
  toast.classList.add("toast-leaving");
  setTimeout(() => toast.remove(), 350);
}

// ─── Media result card in chat ────────────────────────────────────────────────
const IMAGE_GRADIENTS = [
  "linear-gradient(135deg, #8b7dff 0%, #50c8ff 50%, #4ade80 100%)",
  "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b7dff 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #8b7dff 100%)",
  "linear-gradient(135deg, #4ade80 0%, #06b6d4 50%, #8b5cf6 100%)",
];

function pushMediaResultCard(job) {
  const isImage = job.type === "image";
  const wrapper = document.createElement("div");
  wrapper.className = "message bot media-result-card";

  const gradient = IMAGE_GRADIENTS[Math.floor(Math.random() * IMAGE_GRADIENTS.length)];

  if (isImage) {
    wrapper.innerHTML =
      '<small>async media · ' + job.lane + ' · ' + job.credits + ' credits</small>' +
      '<div class="media-placeholder" style="background:' + gradient + '" title="Simulated generated image">' +
        '<div class="media-placeholder-label">Generated Image</div>' +
        '<div class="media-placeholder-sub">' + escapeHtml(truncate(job.prompt, 60)) + '</div>' +
      '</div>';
  } else {
    wrapper.innerHTML =
      '<small>async media · ' + job.lane + ' · ' + job.credits + ' credits</small>' +
      '<div class="media-placeholder video-placeholder" style="background:' + gradient + '" title="Simulated generated video">' +
        '<div class="media-play-icon">▶</div>' +
        '<div class="media-placeholder-label">Generated Video</div>' +
        '<div class="media-placeholder-sub">' + escapeHtml(truncate(job.prompt, 60)) + '</div>' +
      '</div>';
  }

  el.chatLog.appendChild(wrapper);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
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
    return "I can stay present with you while the " + plan.mediaJobs.map(j => j.type).join(" and ") +
      " request runs in the background. I kept the fast path for conversation and sent the heavy media work to " +
      plan.mediaJobs.map(j => j.lane).join(", ") + ".";
  }

  if (/memory|remember/i.test(text)) {
    return "I pinned that intentionally instead of hiding it in a black box. Right now I am grounding on: " + memoryHints + ".";
  }

  if (/tell me|about yourself|introduce/i.test(text)) {
    return state.persona + " speaking: I'm your AI companion running on a low-latency fast path. " +
      "My persona is configured as '" + state.persona + "', tone as '" + state.tone + "'. " +
      "Heavy tasks like generating images go async so I never keep you waiting in conversation.";
  }

  return state.persona + " speaking in a " + toneSnippet + " tone: I heard you say '" +
    truncate(text, 90) + "'. I would answer quickly first, then only escalate to a heavier model or media workflow if needed.";
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
  wrapper.innerHTML =
    (meta ? "<small>" + escapeHtml(meta) + "</small>" : "") +
    "<div>" + escapeHtml(text).replace(/\n/g, "<br>") + "</div>";
  el.chatLog.appendChild(wrapper);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

function renderMemory() {
  persistMemory();
  const query = el.memorySearchInput ? el.memorySearchInput.value.trim().toLowerCase() : "";
  const filtered = query
    ? state.memory.filter((m) => m.text.toLowerCase().includes(query))
    : state.memory;

  el.memoryList.innerHTML = "";
  if (!filtered.length) {
    el.memoryList.innerHTML = '<p class="hint">' + (query ? "No matches." : "No memory pinned yet.") + "</p>";
    return;
  }
  filtered.forEach((item) => {
    const row = document.createElement("div");
    row.className = "memory-item";
    row.innerHTML =
      '<p>' + escapeHtml(item.text) + '</p>' +
      '<div class="memory-meta">' +
        '<span class="badge accent">' + escapeHtml(item.source) + '</span>' +
        '<button class="ghost-btn" data-memory-id="' + item.id + '">Delete</button>' +
      '</div>';
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
    row.innerHTML =
      '<p><strong>' + job.type.toUpperCase() + '</strong> — ' + escapeHtml(truncate(job.prompt, 70)) + '</p>' +
      '<div class="job-meta">' +
        '<span class="badge ' + badgeClass + '">' + job.status + '</span>' +
        '<span>' + job.lane + '</span>' +
        '<span>' + job.credits + ' credits</span>' +
      '</div>' +
      '<div class="job-progress-wrap">' +
        '<div class="job-progress-bar" style="width:' + job.progress + '%"></div>' +
      '</div>' +
      '<div class="job-meta">' +
        '<span>ETA ' + job.etaSeconds + 's</span>' +
        '<span>' + job.progress + '%</span>' +
      '</div>';
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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Session timer ────────────────────────────────────────────────────────────
function tickSession() {
  setInterval(() => {
    const secs = Math.floor((Date.now() - state.sessionStart) / 1000);
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    el.sessionTimer.textContent = m + ":" + s;
  }, 1000);
}

// ─── Speech ──────────────────────────────────────────────────────────────────
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

// ─── Video call simulation ────────────────────────────────────────────────────
const PERSONA_SYMBOLS = {
  "Neon Dreamer":    "◈",
  "Calm Architect":  "◎",
  "Moonlit Traveler":"◉",
};

const CALL_CAPTIONS = [
  "Hey, I'm listening…",
  "Tell me more…",
  "I'm right here with you.",
  "You have my full attention.",
  "I love talking with you.",
  "This is our fast path.",
];

// Simulated turns for the call transcript
const TRANSCRIPT_TURNS = [
  ["You", "Hey, can you hear me?"],
  [null,  "Loud and clear. WebRTC transport is holding steady."],
  ["You", "How's the latency looking?"],
  [null,  "Round-trip is under 180ms right now — fast path is healthy."],
  ["You", "Can you take a photo for me?"],
  [null,  "Sending that to the async queue so our call doesn't stall."],
  ["You", "Nice. This feels smooth."],
  [null,  "That's the goal — separate the fast path from the heavy work."],
];

function updateAvatarSymbol() {
  el.vcAvatarInner.textContent = PERSONA_SYMBOLS[state.persona] || "◎";
}

function toggleVideoCall() {
  if (state.inCall) {
    endVideoCall();
  } else {
    startVideoCall();
  }
}

function startVideoCall() {
  state.inCall = true;
  state.callTick = 0;
  el.videoCallOverlay.classList.remove("hidden");
  el.videoCallBtn.textContent = "📵 End Call";
  el.vcPersonaName.textContent = state.persona;
  updateAvatarSymbol();
  el.vcStatus.textContent = "Connecting…";
  el.vcStatus.className = "badge warn";

  // Clear transcript
  if (el.vcTranscriptLog) el.vcTranscriptLog.innerHTML = "";
  appendVcTranscript("System", "Room joined · ICE negotiating…");

  // Simulate WebRTC ICE handshake delay (~300-700ms)
  setTimeout(() => {
    el.vcStatus.textContent = "Live";
    el.vcStatus.className = "badge ok";
    appendVcTranscript("System", "Connected · fast path active");
    animateCallMetrics();
    startWaveformAnimation();
    state.callInterval = setInterval(tickCall, 2800);
  }, 680);
}

function endVideoCall() {
  state.inCall = false;
  el.videoCallOverlay.classList.add("hidden");
  el.videoCallBtn.textContent = "📹 Start Call";
  if (state.callInterval) {
    clearInterval(state.callInterval);
    state.callInterval = null;
  }
  stopWaveformAnimation();
}

function animateCallMetrics() {
  const transport = 28 + Math.round(Math.random() * 18);
  const agent     = 45 + Math.round(Math.random() * 30);
  const tts       = 55 + Math.round(Math.random() * 25);
  const total     = transport + agent + tts;

  el.vcTransport.textContent  = transport + " ms";
  el.vcAgentLoop.textContent  = agent + " ms";
  el.vcTtsStart.textContent   = tts + " ms";
  el.vcRoundTrip.textContent  = total + " ms";
  el.vcLatencyBadge.textContent = total + " ms";
  el.vcLatencyBadge.className = total < 200 ? "badge ok" : "badge warn";
}

function tickCall() {
  state.callTick++;
  animateCallMetrics();

  // Show caption + transcript turn
  if (state.callTick % 2 === 0) {
    const caption = CALL_CAPTIONS[state.callTick % CALL_CAPTIONS.length];
    showVcCaption(caption);
  }

  // Replay scripted transcript turns
  const turnIdx = state.callTick - 1;
  if (turnIdx < TRANSCRIPT_TURNS.length) {
    const [speaker, text] = TRANSCRIPT_TURNS[turnIdx];
    const label = speaker === "You" ? "You" : state.persona;
    appendVcTranscript(label, text);
  }
}

function appendVcTranscript(speaker, text) {
  if (!el.vcTranscriptLog) return;
  const isUser = speaker === "You";
  const isSystem = speaker === "System";
  const line = document.createElement("div");
  line.className = "vc-transcript-line" +
    (isUser ? " transcript-user" : "") +
    (isSystem ? " transcript-system" : "");
  line.innerHTML =
    '<span class="vc-transcript-speaker">' + escapeHtml(speaker) + ':</span> ' +
    escapeHtml(text);
  el.vcTranscriptLog.appendChild(line);
  el.vcTranscriptLog.scrollTop = el.vcTranscriptLog.scrollHeight;
}

function showVcCaption(text) {
  el.vcCaption.textContent = text;
  el.vcCaption.style.opacity = "1";
  clearTimeout(el.vcCaption._timer);
  el.vcCaption._timer = setTimeout(() => {
    el.vcCaption.style.opacity = "0";
  }, 2600);
}

function startWaveformAnimation() {
  el.vcWaveform.classList.add("active");
  el.vcLocalWaveform.classList.add("active");
}

function stopWaveformAnimation() {
  el.vcWaveform.classList.remove("active");
  el.vcLocalWaveform.classList.remove("active");
}

// ─── ID helper ───────────────────────────────────────────────────────────────
function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
