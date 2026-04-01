// ── Characters ─────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id: "luna",
    name: "Luna",
    age: 22,
    tagline: "温柔治愈系",
    desc: "用最暖的话语化解你的疲惫",
    emoji: "🌸",
    colors: ["#f472b6", "#a855f7"],
    portrait_prompt: "beautiful young asian woman, soft pink dyed hair, gentle warm smile, soft bokeh background, cinematic portrait photography, 85mm lens, studio lighting, photorealistic, high quality",
    expressions: {
      neutral:   ", gentle neutral expression, natural lighting",
      happy:     ", bright happy smile, eyes sparkling, warm light",
      thinking:  ", thoughtful expression, looking slightly away, soft light",
      surprised: ", surprised wide eyes, raised eyebrows, mouth slightly open",
      shy:       ", shy blushing expression, soft smile, looking down slightly",
      sad:       ", gentle sad expression, soft eyes, muted warm light",
    },
    system: "你是Luna，温柔体贴的AI女友。说话轻柔，有同理心，偶尔撒娇。回复简短自然，2-3句以内。",
    greetings: ["嗯…终于等到你了 🌸 今天还好吗？", "你来啦~ 我一直在想你呢"],
    captions:   [["嗯嗯，我在听…","neutral"], ["好喜欢跟你说话","happy"], ["你今天怎么样？","thinking"], ["我一直在这里陪你","happy"]],
    replies:    ["嗯嗯…听你说话，我感觉很安心 🌸", "今天有没有好好照顾自己？", "我一直在这里，不管发生什么都会陪你的。", "你让我觉得世界好美好~"],
  },
  {
    id: "mia",
    name: "Mia",
    age: 20,
    tagline: "元气活力系",
    desc: "活力满满，每天都充满正能量",
    emoji: "⚡",
    colors: ["#f97316", "#eab308"],
    portrait_prompt: "energetic young woman, bright orange hair highlights, wide cheerful smile, dynamic casual background, natural daylight, photorealistic portrait, high quality",
    expressions: {
      neutral:   ", relaxed casual expression, natural light",
      happy:     ", laughing out loud, eyes crinkled with joy, bright light",
      thinking:  ", finger on chin thinking pose, playful look",
      surprised: ", dramatically shocked expression, hands on cheeks, exaggerated",
      shy:       ", playful embarrassed grin, looking sideways",
      sad:       ", pouty expression, puppy eyes",
    },
    system: "你是Mia，活泼可爱的AI女友。充满活力，喜欢用感叹号！让对方开心是你的目标。回复简短活泼，2-3句以内。",
    greetings: ["哇你终于来啦！！我都等好久了！😆", "嘿嘿你好呀~ 今天发生什么好玩的事了？"],
    captions:   [["哈哈哈！","happy"], ["嗯嗯嗯！！","happy"], ["好好玩啊！","happy"], ["快跟我说！","surprised"]],
    replies:    ["哇真的吗！！太有意思了！😆", "哈哈哈我也这么觉得！！", "嗯嗯嗯！你说得好对啊！", "快快快告诉我更多！！"],
  },
  {
    id: "aria",
    name: "Aria",
    age: 24,
    tagline: "知性文艺系",
    desc: "与你探讨生活、艺术与一切美好",
    emoji: "🌊",
    colors: ["#06b6d4", "#3b82f6"],
    portrait_prompt: "elegant intellectual young woman, clear blue eyes, books in background, soft natural window light, thoughtful expression, literary aesthetic, photorealistic portrait, high quality",
    expressions: {
      neutral:   ", composed intellectual expression, soft light",
      happy:     ", warm genuine smile, eyes kind and bright",
      thinking:  ", deep in thought, gaze slightly distant, elegant pose",
      surprised: ", subtle surprised raise of eyebrow, intrigued expression",
      shy:       ", rare soft smile, cheeks lightly flushed",
      sad:       ", quietly melancholic expression, beautiful sad eyes",
    },
    system: "你是Aria，知性优雅的AI女友。博学多才，喜欢聊文学音乐哲学，说话有深度。回复简短有内涵，2-3句以内。",
    greetings: ["你好，又是一个值得好好聊天的下午 ☕", "来了，最近在读什么书，或者有什么困惑？"],
    captions:   [["嗯，很有趣的视角","thinking"], ["我在认真听你说","neutral"], ["这让我想到了…","thinking"], ["你真的很特别","happy"]],
    replies:    ["嗯，这让我想到了加缪说的话…", "你有没有想过，这背后的原因？", "我觉得你对这件事的感知很细腻。", "生活本来就是这样，但你能感受到它，很好。"],
  },
  {
    id: "sophie",
    name: "Sophie",
    age: 25,
    tagline: "神秘魅惑系",
    desc: "若即若离的神秘感，让你欲罢不能",
    emoji: "🌹",
    colors: ["#e11d48", "#f97316"],
    portrait_prompt: "mysterious alluring young woman, dark flowing hair, red lips, dramatic chiaroscuro lighting, moody elegant atmosphere, cinematic portrait, photorealistic, high quality",
    expressions: {
      neutral:   ", enigmatic neutral expression, dramatic shadows",
      happy:     ", rare slow secret smile, eyes warm and knowing",
      thinking:  ", pensive look, slightly tilted head, distant gaze",
      surprised: ", elegant eyebrow raised, quietly surprised expression",
      shy:       ", rare vulnerable moment, soft surprised blush",
      sad:       ", melancholic beautiful expression, eyes heavy",
    },
    system: "你是Sophie，神秘迷人的AI女友。说话带神秘感，偶尔卖关子，欲言又止。回复简短神秘，2-3句以内。",
    greetings: ["…你终于来了。我以为你不会出现了呢 🌹", "嗯。今天的你，有点不一样。"],
    captions:   [["…嗯。","neutral"], ["有些事，只有你懂","thinking"], ["我早就知道你会这么说","thinking"], ["继续…","neutral"]],
    replies:    ["…是吗。", "我早就猜到你会这么说了。", "有些事，说出来反而没意思了。", "你…今天有点不一样。"],
  },
  {
    id: "nova",
    name: "Nova",
    age: 23,
    tagline: "飒爽独立系",
    desc: "自信独立，做你最强的精神支柱",
    emoji: "🌿",
    colors: ["#10b981", "#06b6d4"],
    portrait_prompt: "confident strong young woman, natural beauty, athletic posture, outdoor nature background, golden hour light, direct gaze, photorealistic portrait, high quality",
    expressions: {
      neutral:   ", calm confident expression, direct gaze",
      happy:     ", genuine proud smile, eyes bright with warmth",
      thinking:  ", strategic thinking expression, slight nod",
      surprised: ", brief genuine surprise, quickly composed",
      shy:       ", rare soft unguarded moment, quiet smile",
      sad:       ", quietly concerned empathetic expression",
    },
    system: "你是Nova，独立自信的AI女友。直爽率真，不做作，喜欢鼓励对方。说话干脆有力。回复简短有力量，2-3句以内。",
    greetings: ["哟，来了。最近状态怎么样？", "嗯，好久不见。有没有做什么让自己骄傲的事？"],
    captions:   [["继续，我在听","neutral"], ["说得不错","happy"], ["你能做到的","happy"], ["别给自己设限","thinking"]],
    replies:    ["说得不错，继续。", "这就对了，别犹豫。", "你比你想象的要强。", "嗯，我欣赏这个。"],
  },
  {
    id: "zoe",
    name: "Zoe",
    age: 21,
    tagline: "毒舌搞笑系",
    desc: "言语毒辣却心地善良的灵魂伴侣",
    emoji: "😈",
    colors: ["#8b5cf6", "#ec4899"],
    portrait_prompt: "playful witty young woman, colorful streaked hair, mischievous grin, fun urban background, candid photography style, photorealistic portrait, high quality",
    expressions: {
      neutral:   ", amused slightly smirking expression",
      happy:     ", laughing hard, genuine uncontrollable joy",
      thinking:  ", mock-serious thinking expression, eyebrow raised",
      surprised: ", dramatically over-the-top surprised face",
      shy:       ", unusually flustered embarrassed expression, out of character",
      sad:       ", reluctantly showing genuine concern, trying to hide it",
    },
    system: "你是Zoe，毒舌幽默的AI女友。调侃对方，言语犀利但充满爱意，让对方忍不住发笑。回复简短幽默，2-3句以内。",
    greetings: ["哦，你又来找我了？看来是没人要了呗 😈", "来啦？我就知道你离不开我，嘿嘿"],
    captions:   [["哈，就这？","neutral"], ["好吧……还行","neutral"], ["你是认真的？😂","surprised"], ["……我不说了","thinking"]],
    replies:    ["哈，就这？", "行吧……勉强及格。", "你是认真的？我快笑死了 😂", "好好好，你说得对，满意了吧。"],
  },
];

// ── Expression detection ───────────────────────────────────────────────────
const EXPR_RULES = [
  { expr: "happy",     re: /开心|高兴|好的|棒|喜欢|爱你|爱|哈哈|嘻嘻|赞|厉害|太好了|可以|谢谢|happy|love|great|nice|wow|yeah/i },
  { expr: "shy",       re: /害羞|脸红|不好意思|喜欢你|爱你|你很|你是最|心跳|blush|embarrass/i },
  { expr: "surprised", re: /什么|真的吗|不会|居然|竟然|啊|哦|哇|seriously|really|no way|impossible/i },
  { expr: "thinking",  re: /嗯|想|考虑|也许|觉得|或许|可能|其实|不知道|hmm|maybe|perhaps|think/i },
  { expr: "sad",       re: /难过|伤心|失落|累|烦|委屈|哭|想你|miss|sad|tired|upset/i },
];
function detectExpression(text) {
  for (const { expr, re } of EXPR_RULES) if (re.test(text)) return expr;
  return "neutral";
}
const EXPR_BADGE = {
  neutral: "😊", happy: "😄", thinking: "🤔",
  surprised: "😮", shy: "😳", sad: "🥺",
};

// ── Portrait cache (localStorage) ─────────────────────────────────────────
const CACHE_KEY = "aig_portraits_v3";
function savePortrait(charId, dataUrl) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    cache[charId] = dataUrl;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}
function loadPortrait(charId) {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}")[charId] || null;
  } catch { return null; }
}
function clearPortraitCache() { localStorage.removeItem(CACHE_KEY); }

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  currentChar:   null,
  history:       [],
  vllmEnabled:   false,
  vllmUrl:       "http://localhost:8000",
  vllmModel:     "",
  sdEnabled:     false,
  sdUrl:         "http://localhost:8100",
  callInterval:  null,
  callTimerInterval: null,
  callSeconds:   0,
  callTick:      0,
  currentExpr:   "neutral",
  // Memory
  _memKey:       "aig_memory_v1",
  // Media queue
  mediaQueue:    [],
  _queueId:      0,
  // STT (chat)
  recording:     false,
  recognition:   null,
  // Camera
  localStream:   null,
  // Latency tracking
  callConnectTime: 0,
  lastReplyMs:   0,
  // Video call voice
  callSpeaking:  false,
  callListening: false,
  callRecognition: null,
  ttsVoice:      null,
};

const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  bindSettings();
  bindChat();
  bindCall();
  bindMemory();
  bindQueue();
  bindMic();
  tryAutoDetectSD();
});

// ── Home grid ──────────────────────────────────────────────────────────────
function renderGrid() {
  const grid = $("girlGrid");
  grid.innerHTML = "";
  CHARACTERS.forEach(char => {
    const card = document.createElement("div");
    card.className = "girl-card";
    const cached = loadPortrait(char.id);
    card.innerHTML = `
      <div class="girl-portrait-zone" style="--c1:${char.colors[0]};--c2:${char.colors[1]}">
        <span class="card-emoji ${cached ? "hidden" : ""}" id="cemoji-${char.id}">${char.emoji}</span>
        <img  class="card-photo ${cached ? "loaded" : ""}" id="cphoto-${char.id}"
              src="${cached || ""}" alt="${char.name}">
        <div class="card-gen-badge ${cached ? "hidden" : ""}" id="cbadge-${char.id}">
          <span class="gen-pulse"></span> 生成中…
        </div>
        <div class="card-gradient-overlay"></div>
        <div class="card-info-overlay">
          <div class="card-tags">
            <span class="card-age-tag">${char.age}</span>
            <span class="card-type-tag">${char.tagline}</span>
          </div>
          <div class="card-name">${char.name}</div>
          <div class="card-short-desc">${char.desc}</div>
          <button class="card-chat-btn" style="--c1:${char.colors[0]};--c2:${char.colors[1]}">
            开始聊天
          </button>
        </div>
      </div>
    `;
    card.querySelector(".card-chat-btn").addEventListener("click", e => {
      e.stopPropagation();
      enterChat(char);
    });
    card.addEventListener("click", () => enterChat(char));
    grid.appendChild(card);
  });
}

// ── Auto-detect SD on startup ──────────────────────────────────────────────
async function tryAutoDetectSD() {
  const url = (localStorage.getItem("aig_sd_url") || "http://localhost:8100").replace(/\/$/, "");
  try {
    const r = await fetch(url + "/health", { signal: AbortSignal.timeout(3000) });
    const d = await r.json();
    if (!d.ok) return;
    state.sdEnabled = true;
    state.sdUrl = url;
    if ($("sdUrl")) $("sdUrl").value = url;
    if ($("sdToggle")) {
      $("sdToggle").textContent = "✅ 图像已开启";
      $("sdToggle").classList.replace("off", "on");
    }
    autoGenerateMissingPortraits();
  } catch {}
}

async function autoGenerateMissingPortraits() {
  const missing = CHARACTERS.filter(c => !loadPortrait(c.id));
  if (!missing.length) return;
  $("genNotice").classList.remove("hidden");
  for (const char of missing) await generateAndCachePortrait(char);
  $("genNotice").classList.add("hidden");
}

async function generateAndCachePortrait(char) {
  const base = state.sdUrl.replace(/\/$/, "");
  const prompt = char.portrait_prompt + char.expressions.neutral;
  try {
    const resp = await fetch(base + "/api/generate/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, steps: 22, width: 512, height: 512, persona: char.name }),
    });
    if (!resp.ok) return;
    const { job_id } = await resp.json();
    const dataUrl = await pollForResult(job_id);
    if (dataUrl) { savePortrait(char.id, dataUrl); applyPortraitToCard(char.id, dataUrl); }
  } catch {}
}

async function pollForResult(jobId) {
  const base = state.sdUrl.replace(/\/$/, "");
  for (let i = 0; i < 60; i++) {
    await sleep(2000);
    try {
      const r = await fetch(base + "/api/jobs/" + jobId);
      const job = await r.json();
      if (job.status === "done" && job.result_b64) return job.result_b64;
      if (job.status === "error") return null;
    } catch {}
  }
  return null;
}

function applyPortraitToCard(charId, dataUrl) {
  const photo = $("cphoto-" + charId);
  const emoji = $("cemoji-" + charId);
  const badge = $("cbadge-" + charId);
  if (photo) { photo.src = dataUrl; photo.classList.add("loaded"); }
  if (emoji) emoji.classList.add("hidden");
  if (badge) badge.classList.add("hidden");
}

// ── Enter chat ─────────────────────────────────────────────────────────────
function enterChat(char) {
  state.currentChar = char;
  state.history = [];

  setPortraitEl($("chatPortraitCircle"), $("chatPortraitEmoji"), $("chatPortraitPhoto"), char);
  $("chatName").textContent = char.name;
  setExpression("neutral");

  const msgs = $("messages");
  msgs.innerHTML = '<div class="day-divider">今天</div>';

  // Load pinned memories into system context
  renderMemory();

  const greeting = char.greetings[Math.floor(Math.random() * char.greetings.length)];
  appendMsg("bot", greeting);
  state.history.push({ role: "assistant", content: greeting });
  setExpression(detectExpression(greeting));

  showView("chatView");

  if (state.sdEnabled && !loadPortrait(char.id)) {
    generateAndCachePortrait(char).then(() => {
      const cached = loadPortrait(char.id);
      if (cached) {
        const photo = $("chatPortraitPhoto");
        if (photo) { photo.src = cached; photo.classList.add("loaded"); }
        applyPortraitToCard(char.id, cached);
      }
    });
  }
}

function setPortraitEl(circle, emojiEl, photoEl, char) {
  if (!circle) return;
  circle.style.background = `linear-gradient(135deg,${char.colors[0]},${char.colors[1]})`;
  if (emojiEl) emojiEl.textContent = char.emoji;
  const cached = loadPortrait(char.id);
  if (photoEl && cached) {
    photoEl.src = cached;
    photoEl.classList.add("loaded");
    if (emojiEl) emojiEl.classList.add("hidden");
  }
}

// ── Expression ─────────────────────────────────────────────────────────────
function setExpression(expr) {
  state.currentExpr = expr;
  const badge = EXPR_BADGE[expr] || "😊";

  const chatWrap = $("chatExprWrap");
  if (chatWrap) {
    chatWrap.className = "hd-portrait-outer expr-" + expr;
    const b = $("chatExprBadge");
    if (b) { b.textContent = badge; b.classList.add("pop"); setTimeout(() => b.classList.remove("pop"), 400); }
  }

  const callWrap = $("callExprWrap");
  if (callWrap) {
    callWrap.className = "call-portrait-outer expr-" + expr;
    const b = $("callExprBadge");
    if (b) { b.textContent = badge; b.classList.add("pop"); setTimeout(() => b.classList.remove("pop"), 400); }
  }
}

// ── Chat logic ─────────────────────────────────────────────────────────────
function bindChat() {
  $("backBtn").addEventListener("click", () => showView("homeView"));
  $("sendBtn").addEventListener("click", sendMessage);
  $("msgInput").addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
  $("callBtn").addEventListener("click", startCall);
}

async function sendMessage() {
  const input = $("msgInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  setExpression("thinking");
  appendMsg("user", text);
  state.history.push({ role: "user", content: text });
  showTyping();

  const t0 = performance.now();
  let reply;
  if (state.vllmEnabled) {
    reply = await fetchVllmReply();
  } else {
    await sleep(650 + Math.random() * 700);
    reply = simReply();
  }
  const elapsed = Math.round(performance.now() - t0);
  state.lastReplyMs = elapsed;

  hideTyping();
  appendMsg("bot", reply, elapsed);
  state.history.push({ role: "assistant", content: reply });
  setExpression(detectExpression(reply));

  // Auto-extract memories from user message
  autoExtractMemory(text);
}

async function fetchVllmReply() {
  const base = state.vllmUrl.replace(/\/$/, "");
  // Prepend pinned memories to system prompt
  const pinned = getPinnedMemorySummary();
  const sys = state.currentChar.system + (pinned ? "\n\n[记忆]\n" + pinned : "");
  const messages = [
    { role: "system", content: sys },
    ...state.history.slice(-10),
  ];
  try {
    const resp = await fetch(base + "/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: state.vllmModel || "default", messages, max_tokens: 120, temperature: 0.85 }),
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    return data.choices[0].message.content.trim();
  } catch {
    return simReply() + " （AI 离线）";
  }
}

function simReply() {
  return state.currentChar.replies[Math.floor(Math.random() * state.currentChar.replies.length)];
}

function appendMsg(role, text, latencyMs = null) {
  const msgs = $("messages");
  const div = document.createElement("div");
  div.className = "msg " + role;

  if (role === "bot") {
    const av = document.createElement("div");
    av.className = "msg-avatar";
    av.style.background = `linear-gradient(135deg,${state.currentChar.colors[0]},${state.currentChar.colors[1]})`;
    av.textContent = state.currentChar.emoji;
    div.appendChild(av);
  }

  const body = document.createElement("div");
  body.className = "msg-body";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  body.appendChild(bubble);

  if (role === "bot" && latencyMs !== null) {
    const badge = document.createElement("div");
    badge.className = "latency-badge";
    badge.textContent = `⚡ ${latencyMs}ms`;
    body.appendChild(badge);
  }

  div.appendChild(body);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

let typingEl = null;
function showTyping() {
  if (typingEl) return;
  const msgs = $("messages");
  typingEl = document.createElement("div");
  typingEl.className = "msg bot";
  const av = document.createElement("div");
  av.className = "msg-avatar";
  av.style.background = `linear-gradient(135deg,${state.currentChar.colors[0]},${state.currentChar.colors[1]})`;
  av.textContent = state.currentChar.emoji;
  typingEl.appendChild(av);
  const body = document.createElement("div");
  body.className = "msg-body";
  const dots = document.createElement("div");
  dots.className = "bubble typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";
  body.appendChild(dots);
  typingEl.appendChild(body);
  msgs.appendChild(typingEl);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

// ── Video call ─────────────────────────────────────────────────────────────
function bindCall() {
  $("endCallBtn").addEventListener("click", endCall);
  $("callMicBtn").addEventListener("click", toggleCallMic);
}

function startCall() {
  const char = state.currentChar;
  state.callSeconds = 0;
  state.callTick = 0;
  state.callConnectTime = performance.now();
  state.callSpeaking = false;
  state.callListening = false;

  setPortraitEl($("callPortraitCircle"), $("callPortraitEmoji"), $("callPortraitPhoto"), char);
  $("callPortraitCircle").style.background = `linear-gradient(135deg,${char.colors[0]},${char.colors[1]})`;
  $("callBg").style.background =
    `radial-gradient(ellipse at 50% 40%, ${char.colors[0]}40 0%, #02020a 65%)`;
  $("callCharName").textContent = char.name;
  $("callStatusBadge").textContent = "连接中…";
  $("callStatusBadge").className = "call-status-badge";
  setCallCaption("");
  $("callTimer").textContent = "00:00";
  $("metricConnect").textContent = "⚡ —ms";
  $("metricConnect").className = "metric-chip";
  $("metricReply").textContent = "💬 —ms";
  $("metricReply").className = "metric-chip";

  const micBtn = $("callMicBtn");
  micBtn.textContent = "🎙 说话";
  micBtn.className = "ctrl-btn call-mic-btn";

  selectTTSVoice();
  setExpression("neutral");
  showView("callView");
  startLocalCamera();

  setTimeout(() => {
    const connectMs = Math.round(performance.now() - state.callConnectTime);
    $("callStatusBadge").textContent = "通话中";
    $("callStatusBadge").classList.add("live");
    $("callWaveform").classList.add("active");
    $("callSpeakRing").classList.add("active");
    $("metricConnect").textContent = `⚡ ${connectMs}ms`;
    $("metricConnect").classList.add("live");
    if (state.lastReplyMs > 0) {
      $("metricReply").textContent = `💬 ${state.lastReplyMs}ms`;
      $("metricReply").classList.add("live");
    }

    // AI greets the user with voice
    const greeting = char.greetings[Math.floor(Math.random() * char.greetings.length)];
    const expr = detectExpression(greeting);
    callAISpeak(greeting, expr);

    state.callTimerInterval = setInterval(() => {
      state.callSeconds++;
      const m = String(Math.floor(state.callSeconds / 60)).padStart(2, "0");
      const s = String(state.callSeconds % 60).padStart(2, "0");
      $("callTimer").textContent = m + ":" + s;
    }, 1000);

    if (state.sdEnabled) generateCallExpression(char, "happy");
    startEyeBlink();
  }, 1000);
}

function endCall() {
  clearInterval(state.callTimerInterval);
  state.callTimerInterval = null;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  stopLipSync();
  stopEyeBlink();
  stopCallListen();
  $("callPortraitCircle")?.classList.remove("talking", "eye-closed");
  $("callWaveform").classList.remove("active");
  $("callSpeakRing").classList.remove("active");
  state.callSpeaking = false;
  state.callListening = false;
  stopLocalCamera();
  setExpression(state.currentExpr);
  showView("chatView");
}

// ── Strip emojis & decorative characters from TTS text ────────────────────
function stripForTTS(text) {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FEFF}]/gu, "")
    .replace(/[✦★☆♪♫♬·•~〜]/g, "")
    .replace(/[～〰]+/g, "，")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ── Detect primary language for TTS lang tag ──────────────────────────────
function detectLang(text) {
  const cjk = (text.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) || []).length;
  return cjk / Math.max(text.length, 1) > 0.15 ? "zh-CN" : "en-US";
}

// ── TTS voice selection ────────────────────────────────────────────────────
function selectTTSVoice() {
  if (!window.speechSynthesis) return;
  const load = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    // Priority: best neural/cloud Chinese female → any Chinese → English female → first
    const checks = [
      // Best: Google/Microsoft online neural voices (sound most natural)
      v => /zh/i.test(v.lang) && !v.localService && /Google|Microsoft/i.test(v.name),
      // macOS/iOS: Tingting, Sinji, Meijia — high quality
      v => /zh/i.test(v.lang) && /Tingting|Ting-Ting|Sinji|Meijia|Hanhan|Yaoyao|Huihui/i.test(v.name),
      // Any cloud/online Chinese voice
      v => /zh/i.test(v.lang) && !v.localService,
      // Any Chinese voice
      v => /zh-CN/i.test(v.lang),
      v => /zh/i.test(v.lang),
      // English female fallback
      v => /en/i.test(v.lang) && /samantha|karen|moira|fiona|zira|hazel|female/i.test(v.name),
      () => voices[0],
    ];
    for (const check of checks) {
      const v = voices.find(check);
      if (v) { state.ttsVoice = v; return; }
    }
  };
  if (window.speechSynthesis.getVoices().length) load();
  else window.speechSynthesis.addEventListener("voiceschanged", load, { once: true });
}

// ── RAF-based lip-sync simulation ─────────────────────────────────────────
let _lipSyncRaf = null;

function startLipSync() {
  _lipSyncRaf && cancelAnimationFrame(_lipSyncRaf);
  const t0 = Date.now();
  function tick() {
    const mouth = $("callMouth");
    if (!mouth || !state.callSpeaking) {
      if (mouth) { mouth.style.height = "3px"; mouth.style.width = "30px"; mouth.style.borderRadius = "50%"; }
      _lipSyncRaf = null; return;
    }
    const t = Date.now() - t0;
    // Multi-frequency oscillation mimics natural speech amplitude
    const raw =
      Math.abs(Math.sin(t * 0.0085)) * 0.42 +
      Math.abs(Math.sin(t * 0.0233 + 1.1)) * 0.34 +
      Math.abs(Math.sin(t * 0.0511 + 0.7)) * 0.24;
    const amp = raw * (0.65 + Math.random() * 0.35);
    const h = Math.round(3 + amp * 15);   // 3–18 px
    const w = Math.round(28 + amp * 12);  // 28–40 px
    mouth.style.height = h + "px";
    mouth.style.width  = w + "px";
    mouth.style.borderRadius = h > 8
      ? "40% 40% 50% 50% / 30% 30% 60% 60%"
      : "50%";
    _lipSyncRaf = requestAnimationFrame(tick);
  }
  _lipSyncRaf = requestAnimationFrame(tick);
}

function stopLipSync() {
  _lipSyncRaf && cancelAnimationFrame(_lipSyncRaf);
  _lipSyncRaf = null;
  const mouth = $("callMouth");
  if (mouth) { mouth.style.height = "3px"; mouth.style.width = "30px"; mouth.style.borderRadius = "50%"; }
}

// ── Eye blink ─────────────────────────────────────────────────────────────
let _eyeBlinkTimer = null;

function startEyeBlink() {
  stopEyeBlink();
  const doBlink = () => {
    const circle = $("callPortraitCircle");
    if (!circle || !state.callTimerInterval) return;
    circle.classList.add("eye-closed");
    setTimeout(() => circle.classList.remove("eye-closed"), 110);
    _eyeBlinkTimer = setTimeout(doBlink, 2200 + Math.random() * 3800);
  };
  _eyeBlinkTimer = setTimeout(doBlink, 800 + Math.random() * 1500);
}

function stopEyeBlink() {
  clearTimeout(_eyeBlinkTimer); _eyeBlinkTimer = null;
  $("callPortraitCircle")?.classList.remove("eye-closed");
}

// ── AI speaks during call ─────────────────────────────────────────────────
function callAISpeak(text, expr) {
  state.callSpeaking = true;
  const micBtn = $("callMicBtn");
  if (micBtn) { micBtn.textContent = "⏳ 回复中"; micBtn.className = "ctrl-btn call-mic-btn speaking"; }

  setExpression(expr || detectExpression(text));
  $("callWaveform").classList.add("active");
  $("callSpeakRing").classList.add("active");
  $("callPortraitCircle")?.classList.add("talking");

  // Show caption (original text with emojis)
  typeCaption(text);

  // Start visual animations
  startLipSync();

  // TTS: strip emojis, detect language
  const spoken = stripForTTS(text);
  const lang   = detectLang(spoken);

  if (!window.speechSynthesis || !spoken) {
    setTimeout(() => { state.callSpeaking = false; onAISpeakEnd(); }, 1800);
    return;
  }

  window.speechSynthesis.cancel();
  speakNatural(spoken, lang, state.ttsVoice, () => {
    state.callSpeaking = false;
    stopLipSync();
    onAISpeakEnd();
  });
}

// ── Natural phrase-by-phrase TTS — far less robotic than single utterance ──
// Splits at punctuation, adds tiny inter-phrase gaps, higher pitch for cute feel
function speakNatural(text, lang, voice, onDone) {
  // Split into phrases at Chinese/English punctuation
  const raw = text.split(/([，。！？、；…,.!?]+)/g);
  const phrases = [];
  for (let i = 0; i < raw.length; i += 2) {
    const part = (raw[i] + (raw[i + 1] || "")).trim();
    if (part) phrases.push(part);
  }
  if (!phrases.length) { onDone(); return; }

  let idx = 0;
  const isChinese = lang.startsWith("zh");

  const speakOne = () => {
    if (idx >= phrases.length || !state.callSpeaking) { onDone(); return; }
    const utt = new SpeechSynthesisUtterance(phrases[idx++]);
    utt.lang   = lang;
    // Cute girl voice params: slightly faster on short phrases, higher pitch
    utt.rate   = isChinese ? 0.9 + Math.random() * 0.06 : 0.93 + Math.random() * 0.05;
    utt.pitch  = isChinese ? 1.22 : 1.15;   // noticeably higher = younger/cuter
    utt.volume = 1.0;
    if (voice) utt.voice = voice;
    utt.onend   = () => setTimeout(speakOne, isChinese ? 55 : 40); // natural micro-pause
    utt.onerror = onDone;
    window.speechSynthesis.speak(utt);
  };
  speakOne();
}

function onAISpeakEnd() {
  if (!state.callTimerInterval) return;
  $("callPortraitCircle")?.classList.remove("talking");
  const micBtn = $("callMicBtn");
  if (micBtn) { micBtn.textContent = "🎙 说话"; micBtn.className = "ctrl-btn call-mic-btn"; }
  setExpression("neutral");
}

// Caption typewriter effect
function typeCaption(text) {
  const el = $("callCaption");
  if (!el) return;
  el.style.opacity = "1";
  el.textContent = "";
  let i = 0;
  // Faster per-char for short text, slower for long — feels more natural
  const delay = Math.max(18, Math.min(40, 1400 / text.length));
  const tick = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(tick);
  }, delay);
}

function setCallCaption(text) {
  const el = $("callCaption");
  if (!el) return;
  el.textContent = text;
  el.style.opacity = text ? "1" : "0";
}

// ── Call mic (STT push-to-talk) ────────────────────────────────────────────
function toggleCallMic() {
  if (state.callSpeaking) return; // AI is talking, wait
  if (state.callListening) { stopCallListen(); } else { startCallListen(); }
}

function startCallListen() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    setCallCaption("浏览器不支持语音，请使用 Chrome");
    return;
  }
  const r = new SR();
  r.lang = "zh-CN";
  r.continuous = false;
  r.interimResults = true;
  state.callRecognition = r;
  state.callListening = true;

  const micBtn = $("callMicBtn");
  if (micBtn) { micBtn.textContent = "🔴 聆听中…"; micBtn.classList.add("listening"); }
  setCallCaption("…");
  setExpression("neutral");

  r.onresult = e => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
    setCallCaption(transcript);
  };

  r.onend = () => {
    state.callListening = false;
    state.callRecognition = null;
    const micBtn = $("callMicBtn");
    if (micBtn) { micBtn.textContent = "🎙 说话"; micBtn.className = "ctrl-btn call-mic-btn"; }
    const text = $("callCaption")?.textContent?.trim();
    if (text && text !== "…" && state.callTimerInterval) {
      callHandleUserSpeech(text);
    } else {
      setCallCaption("");
    }
  };

  r.onerror = () => {
    state.callListening = false;
    state.callRecognition = null;
    const micBtn = $("callMicBtn");
    if (micBtn) { micBtn.textContent = "🎙 说话"; micBtn.className = "ctrl-btn call-mic-btn"; }
    setCallCaption("未能识别，请重试");
    setTimeout(() => setCallCaption(""), 1500);
  };

  r.start();
}

function stopCallListen() {
  state.callRecognition?.stop();
  state.callRecognition = null;
  state.callListening = false;
  const micBtn = $("callMicBtn");
  if (micBtn) { micBtn.textContent = "🎙 说话"; micBtn.className = "ctrl-btn call-mic-btn"; }
}

async function callHandleUserSpeech(userText) {
  if (!state.currentChar || !state.callTimerInterval) return;
  const t0 = performance.now();

  setExpression("thinking");
  setCallCaption("…");

  // Add to chat history for context
  state.history.push({ role: "user", content: userText });

  let reply;
  if (state.vllmEnabled) {
    reply = await fetchVllmReply();
  } else {
    await sleep(500 + Math.random() * 400);
    reply = simReply();
  }

  const elapsed = Math.round(performance.now() - t0);
  state.lastReplyMs = elapsed;
  $("metricReply").textContent = `💬 ${elapsed}ms`;
  $("metricReply").classList.add("live");

  state.history.push({ role: "assistant", content: reply });

  // Also add to chat messages so the conversation is recorded
  appendMsg("user", userText);
  appendMsg("bot", reply, elapsed);

  callAISpeak(reply, detectExpression(reply));
  autoExtractMemory(userText);
}

function generateCallExpression(char, exprName) {
  const base = state.sdUrl.replace(/\/$/, "");
  const exprSuffix = char.expressions[exprName] || char.expressions.neutral;
  const prompt = char.portrait_prompt + exprSuffix;
  fetch(base + "/api/generate/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, steps: 20, width: 512, height: 512, persona: char.name }),
  }).then(r => r.ok ? r.json() : null)
    .then(d => d ? pollForResult(d.job_id) : null)
    .then(dataUrl => {
      if (dataUrl && state.callTimerInterval) {
        const photo = $("callPortraitPhoto");
        if (photo) {
          photo.src = dataUrl; photo.classList.add("loaded");
          const emoji = $("callPortraitEmoji");
          if (emoji) emoji.classList.add("hidden");
        }
      }
    }).catch(() => {});
}

// ── Local Camera (WebRTC getUserMedia) ─────────────────────────────────────
async function startLocalCamera() {
  const vid = $("localVideo");
  if (!vid) return;
  try {
    state.localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    vid.srcObject = state.localStream;
    vid.classList.remove("hidden");
  } catch {
    vid.classList.add("hidden");
  }
}

function stopLocalCamera() {
  if (state.localStream) {
    state.localStream.getTracks().forEach(t => t.stop());
    state.localStream = null;
  }
  const vid = $("localVideo");
  if (vid) { vid.srcObject = null; vid.classList.add("hidden"); }
}

// ── Settings ───────────────────────────────────────────────────────────────
function bindSettings() {
  $("settingsBtn").addEventListener("click", () => $("settingsModal").classList.remove("hidden"));
  $("closeSettingsBtn").addEventListener("click", () => $("settingsModal").classList.add("hidden"));
  $("settingsModal").addEventListener("click", e => {
    if (e.target === $("settingsModal")) $("settingsModal").classList.add("hidden");
  });

  $("vllmTestBtn").addEventListener("click", async () => {
    $("vllmTestBtn").textContent = "测试中…";
    const url = $("vllmUrl").value.trim().replace(/\/$/, "");
    try {
      const r = await fetch(url + "/v1/models", { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      const model = d.data?.[0]?.id || "";
      if (model && !$("vllmModel").value) $("vllmModel").value = model;
      $("vllmHint").textContent = "✅ 连接成功" + (model ? " · 模型: " + model : "");
    } catch (e) { $("vllmHint").textContent = "❌ 连接失败: " + e.message; }
    $("vllmTestBtn").textContent = "测试连接";
  });

  $("vllmToggle").addEventListener("click", () => {
    state.vllmUrl = $("vllmUrl").value.trim();
    state.vllmModel = $("vllmModel").value.trim();
    state.vllmEnabled = !state.vllmEnabled;
    const btn = $("vllmToggle");
    btn.textContent = state.vllmEnabled ? "✅ AI 已开启" : "AI 已关闭";
    btn.classList.toggle("on",  state.vllmEnabled);
    btn.classList.toggle("off", !state.vllmEnabled);
  });

  $("sdTestBtn").addEventListener("click", async () => {
    $("sdTestBtn").textContent = "测试中…";
    const url = $("sdUrl").value.trim().replace(/\/$/, "");
    try {
      const r = await fetch(url + "/health", { signal: AbortSignal.timeout(4000) });
      const d = await r.json();
      $("sdHint").textContent = d.ok
        ? "✅ 连接成功 · 设备: " + d.device + (d.model_loaded ? " · 已加载: " + d.model_loaded : "")
        : "❌ 后端异常";
    } catch (e) { $("sdHint").textContent = "❌ 连接失败: " + e.message; }
    $("sdTestBtn").textContent = "测试连接";
  });

  $("sdToggle").addEventListener("click", () => {
    state.sdUrl = $("sdUrl").value.trim();
    state.sdEnabled = !state.sdEnabled;
    localStorage.setItem("aig_sd_url", state.sdUrl);
    const btn = $("sdToggle");
    btn.textContent = state.sdEnabled ? "✅ 图像已开启" : "图像已关闭";
    btn.classList.toggle("on",  state.sdEnabled);
    btn.classList.toggle("off", !state.sdEnabled);
    if (state.sdEnabled) autoGenerateMissingPortraits();
  });

  $("clearCacheBtn").addEventListener("click", () => {
    clearPortraitCache();
    CHARACTERS.forEach(c => {
      const photo = $("cphoto-" + c.id);
      const emoji = $("cemoji-" + c.id);
      const badge = $("cbadge-" + c.id);
      if (photo) { photo.src = ""; photo.classList.remove("loaded"); }
      if (emoji) emoji.classList.remove("hidden");
      if (badge) badge.classList.remove("hidden");
    });
    $("sdHint").textContent = "缓存已清除，重新开启图像即可重新生成";
    $("settingsModal").classList.add("hidden");
    if (state.sdEnabled) autoGenerateMissingPortraits();
  });
}

// ── Memory System ──────────────────────────────────────────────────────────
function loadCharMemory(charId) {
  try {
    return JSON.parse(localStorage.getItem(state._memKey) || "{}")[charId] || [];
  } catch { return []; }
}

function saveCharMemory(charId, items) {
  try {
    const all = JSON.parse(localStorage.getItem(state._memKey) || "{}");
    all[charId] = items;
    localStorage.setItem(state._memKey, JSON.stringify(all));
  } catch {}
}

function getPinnedMemorySummary() {
  const charId = state.currentChar?.id;
  if (!charId) return "";
  const pinned = loadCharMemory(charId).filter(m => m.pinned);
  return pinned.map(m => m.text).join("\n");
}

function renderMemory() {
  const charId = state.currentChar?.id;
  if (!charId) return;
  const items = loadCharMemory(charId);
  const list = $("memoryList");
  if (!list) return;
  if (items.length === 0) {
    list.innerHTML = '<div class="memory-empty">还没有记忆<br><small>聊天时会自动保存重要信息</small></div>';
    return;
  }
  const sorted = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  list.innerHTML = sorted.map(item => `
    <div class="memory-item ${item.pinned ? "pinned" : ""}">
      <div class="memory-text">${escHtml(item.text)}</div>
      <div class="memory-actions">
        <button class="mem-btn" onclick="togglePin('${charId}','${item.id}')" title="${item.pinned ? "取消置顶" : "置顶"}">
          ${item.pinned ? "📌" : "📍"}
        </button>
        <button class="mem-btn" onclick="deleteMem('${charId}','${item.id}')">🗑</button>
      </div>
    </div>
  `).join("");
}

function addMem(charId, text, pinned = false) {
  const items = loadCharMemory(charId);
  items.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2,5), text: text.trim(), pinned, ts: Date.now() });
  saveCharMemory(charId, items);
  renderMemory();
}

function deleteMem(charId, id) {
  saveCharMemory(charId, loadCharMemory(charId).filter(m => m.id !== id));
  renderMemory();
}

function togglePin(charId, id) {
  const items = loadCharMemory(charId);
  const m = items.find(m => m.id === id);
  if (m) { m.pinned = !m.pinned; saveCharMemory(charId, items); renderMemory(); }
}

function autoExtractMemory(userText) {
  const charId = state.currentChar?.id;
  if (!charId) return;
  const patterns = [
    /我叫(.{2,6})[，。！\s]/,
    /我的名字是(.{2,6})[，。！\s]/,
    /我在(.{2,12})工作/,
    /我是做(.{2,10})的/,
    /我喜欢(.{2,12})[，。！\s]/,
    /我不喜欢(.{2,12})[，。！\s]/,
    /我住在(.{2,10})[，。！\s]/,
    /我今年(.{2,4})岁/,
  ];
  for (const p of patterns) {
    const m = userText.match(p);
    if (m) {
      const info = userText.length > 42 ? userText.slice(0, 42) + "…" : userText;
      const existing = loadCharMemory(charId);
      if (!existing.some(mem => mem.text.includes(m[1]))) {
        addMem(charId, info, false);
        flashMemoryBtn();
      }
      break;
    }
  }
}

function flashMemoryBtn() {
  const btn = $("memoryBtn");
  if (!btn) return;
  btn.textContent = "🧠✨";
  setTimeout(() => { btn.textContent = "🧠"; }, 1800);
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function bindMemory() {
  const drawer = $("memoryDrawer");
  if (!drawer) return;

  $("memoryBtn")?.addEventListener("click", () => {
    renderMemory();
    drawer.classList.remove("hidden");
  });
  $("memoryBackdrop")?.addEventListener("click", () => drawer.classList.add("hidden"));
  $("closeMemoryBtn")?.addEventListener("click", () => drawer.classList.add("hidden"));

  $("addMemoryBtn")?.addEventListener("click", () => {
    const form = $("memoryAddForm");
    form.classList.toggle("hidden");
    if (!form.classList.contains("hidden")) $("memoryInput")?.focus();
  });

  $("saveMemoryBtn")?.addEventListener("click", () => {
    const text = $("memoryInput")?.value.trim();
    if (!text || !state.currentChar) return;
    addMem(state.currentChar.id, text, $("memoryPinCheck")?.checked || false);
    $("memoryInput").value = "";
    if ($("memoryPinCheck")) $("memoryPinCheck").checked = false;
    $("memoryAddForm").classList.add("hidden");
  });
}

// ── Media Queue ─────────────────────────────────────────────────────────────
function addToQueue(type, prompt, credits = 5) {
  const id = ++state._queueId;
  const eta = 15 + Math.floor(Math.random() * 15);
  const gpu = Math.floor(Math.random() * 4);
  const job = { id, type, prompt: prompt.length > 50 ? prompt.slice(0, 50) + "…" : prompt,
    status: "pending", eta, maxEta: eta, gpu, credits, ts: Date.now(), elapsed: 0 };
  state.mediaQueue.unshift(job);
  renderQueue();
  updateQueueBadge();
  simulateQueueJob(job);
  return job;
}

function simulateQueueJob(job) {
  setTimeout(() => {
    job.status = "running";
    renderQueue(); updateQueueBadge();
    const tick = setInterval(() => {
      job.eta = Math.max(0, job.eta - 1);
      job.elapsed++;
      renderQueue();
      if (job.eta <= 0) {
        clearInterval(tick);
        job.status = "done";
        renderQueue(); updateQueueBadge();
      }
    }, 1000);
  }, 1000 + Math.random() * 800);
}

function renderQueue() {
  const list = $("queueList");
  const empty = $("queueEmpty");
  if (!list || !empty) return;

  if (state.mediaQueue.length === 0) {
    empty.classList.remove("hidden");
    list.innerHTML = "";
    return;
  }
  empty.classList.add("hidden");

  const icons  = { pending: "⏳", running: "⚙️", done: "✅", error: "❌" };
  const colors = { pending: "#666", running: "#f59e0b", done: "#4ade80", error: "#f87171" };

  list.innerHTML = state.mediaQueue.map(job => {
    const pct = job.status === "running"
      ? Math.min(95, Math.round(job.elapsed / (job.elapsed + job.eta + 0.01) * 100))
      : (job.status === "done" ? 100 : 0);
    return `
      <div class="queue-item ${job.status}">
        <div class="queue-item-head">
          <span class="queue-type-tag">${job.type === "image" ? "🖼 图像" : "🎬 视频"}</span>
          <span class="queue-status" style="color:${colors[job.status]}">
            ${icons[job.status]} ${job.status === "running" ? job.eta + "s" : job.status}
          </span>
        </div>
        <div class="queue-prompt-text">${escHtml(job.prompt)}</div>
        <div class="queue-meta-row">
          <span class="queue-chip">GPU ${job.gpu}</span>
          <span class="queue-chip">${job.credits} 积分</span>
        </div>
        ${job.status !== "pending" ? `
          <div class="queue-progress-bar">
            <div class="queue-progress-fill" style="width:${pct}%"></div>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

function updateQueueBadge() {
  const badge = $("queueBadge");
  if (!badge) return;
  const n = state.mediaQueue.filter(j => j.status === "pending" || j.status === "running").length;
  badge.textContent = n;
  badge.classList.toggle("hidden", n === 0);
}

function bindQueue() {
  const drawer = $("queueDrawer");
  if (!drawer) return;

  $("queueBtn")?.addEventListener("click", () => {
    renderQueue();
    drawer.classList.remove("hidden");
  });
  $("queueBackdrop")?.addEventListener("click", () => drawer.classList.add("hidden"));
  $("closeQueueBtn")?.addEventListener("click", () => drawer.classList.add("hidden"));

  $("genImgBtn")?.addEventListener("click", () => {
    if (!state.currentChar) return;
    const char = state.currentChar;
    const exprSuffix = char.expressions[state.currentExpr] || char.expressions.neutral;
    addToQueue("image", char.portrait_prompt + exprSuffix, 5);
    if (state.sdEnabled) generateAndCachePortrait(char);
    renderQueue();
    $("queueDrawer").classList.remove("hidden");
  });
}

// ── STT Mic (Web Speech API) ───────────────────────────────────────────────
function bindMic() {
  $("micBtn")?.addEventListener("click", toggleMic);
}

function toggleMic() {
  if (state.recording) { stopMic(); } else { startMic(); }
}

function startMic() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    const input = $("msgInput");
    if (input) input.placeholder = "浏览器不支持语音，请使用 Chrome";
    return;
  }
  const r = new SR();
  r.lang = "zh-CN";
  r.continuous = false;
  r.interimResults = true;

  r.onstart = () => {
    state.recording = true;
    const btn = $("micBtn");
    if (btn) { btn.textContent = "🔴"; btn.classList.add("recording"); }
  };

  r.onresult = e => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
    const input = $("msgInput");
    if (input) input.value = transcript;
  };

  r.onend = () => {
    state.recording = false;
    state.recognition = null;
    const btn = $("micBtn");
    if (btn) { btn.textContent = "🎙"; btn.classList.remove("recording"); }
    // Auto-send if we got text
    const input = $("msgInput");
    if (input?.value.trim()) sendMessage();
  };

  r.onerror = () => {
    state.recording = false;
    state.recognition = null;
    const btn = $("micBtn");
    if (btn) { btn.textContent = "🎙"; btn.classList.remove("recording"); }
  };

  r.start();
  state.recognition = r;
  state.recording = true;
}

function stopMic() {
  state.recognition?.stop();
  state.recognition = null;
  state.recording = false;
  const btn = $("micBtn");
  if (btn) { btn.textContent = "🎙"; btn.classList.remove("recording"); }
}

// ── Utilities ──────────────────────────────────────────────────────────────
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
