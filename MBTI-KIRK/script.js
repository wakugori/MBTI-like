// ===========================
// 性格診断アプリ - メインロジック
// ===========================

const state = {
  currentQuestion: 0,
  chosenTexts: [],        // 選んだ選択肢のテキスト（トートロジー説明用）
  accumulatedLetters: "", // 蓄積されたアルファベット
  choiceOrderByQuestion: {}, // 質問ごとの選択肢表示順（元インデックス配列）
  isAnimating: false,
  bgmAudio: null,         // 再生中のBGMオブジェクト
  lang: "ja",             // 現在の言語
};

// ===========================
// DOM要素
// ===========================
const screens = {
  lang:   document.getElementById("screen-lang"),
  start:  document.getElementById("screen-start"),
  quiz:   document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const el = {
  startBtn:          document.getElementById("btn-start"),
  questionNumber:    document.getElementById("question-number"),
  questionTotal:     document.getElementById("question-total"),
  questionText:      document.getElementById("question-text"),
  choicesContainer:  document.getElementById("choices-container"),
  progressBar:       document.getElementById("progress-bar"),
  progressPercent:   document.getElementById("progress-percent"),
  keyboardHint:      document.getElementById("keyboard-hint"),
  letterDisplay:     document.getElementById("letter-display"),
  currentLetters:    document.getElementById("current-letters"),
  resultType:        document.getElementById("result-type"),
  resultDescription: document.getElementById("result-description"),
  resultPortrait:    document.getElementById("result-portrait"),
  bgmIndicator:      document.getElementById("bgm-indicator"),
  bgmStopBtn:        document.getElementById("btn-bgm-stop"),
  retryBtn:          document.getElementById("btn-retry"),
  shareBtn:          document.getElementById("btn-share"),

  // 言語関連
  langToggle:        document.getElementById("btn-lang-toggle"),
  langFlag:          document.getElementById("lang-flag"),
  langCode:          document.getElementById("lang-code"),
  langBtnJa:         document.getElementById("btn-lang-ja"),
  langBtnEn:         document.getElementById("btn-lang-en"),
};

const CHARLIE_TARGET = "CHARLIEKIRK";
const MAX_PORTRAIT_BLUR_PX = 20;

// ===========================
// 言語管理
// ===========================
function t() {
  return I18N[state.lang];
}

/**
 * { ja, en } オブジェクトまたは文字列から現在の言語のテキストを返す。
 * 対応する言語が未定義の場合は ja → en → 空文字 の順でフォールバック。
 * @param {string|{ja?:string, en?:string}} textObj
 */
function loc(textObj) {
  if (typeof textObj === "string" || textObj === undefined || textObj === null) {
    return textObj ?? "";
  }
  return textObj[state.lang] ?? textObj.ja ?? textObj.en ?? "";
}

/** UIテキストを現在の言語に更新 */
function applyLang() {
  const tx = t();

  // <html lang>
  document.documentElement.lang = tx.htmlLang;

  // <title>
  document.getElementById("page-title").textContent = tx.pageTitle;

  // 言語トグルボタン
  const isJa = state.lang === "ja";
  el.langFlag.src = isJa ? "https://flagcdn.com/24x18/jp.png" : "https://flagcdn.com/24x18/us.png";
  el.langFlag.alt = isJa ? "JP" : "US";
  el.langCode.textContent = isJa ? "JA" : "EN";

  // 言語選択画面
  document.getElementById("lang-select-title").textContent = tx.langSelectTitle;
  document.getElementById("lang-select-sub").textContent   = tx.langSelectSub;

  // スタート画面
  document.getElementById("logo-badge-text").textContent = tx.logoBadge;
  document.getElementById("start-title").innerHTML        = tx.startTitle;
  document.getElementById("start-subtitle").innerHTML     = tx.startSubtitle;
  document.getElementById("stat-label-q").textContent       = tx.statLabelQ;
  document.getElementById("stat-label-choices").textContent  = tx.statLabelChoices;
  document.getElementById("stat-label-each").textContent     = tx.statLabelEach;
  document.getElementById("stat-time").textContent           = tx.statTime || "~2 min";
  document.getElementById("stat-label-time").textContent     = tx.statLabelTime;
  document.getElementById("start-btn-text").textContent   = tx.startBtn;
  document.getElementById("start-note").textContent       = tx.startNote;
  el.questionTotal.textContent = quizData.questions.length;

  // クイズ画面
  document.getElementById("letter-label-text").textContent = tx.letterLabel;

  // BGMインジケーター
  document.getElementById("bgm-label-text").textContent = tx.bgmLabel;

  // 結果画面
  document.getElementById("result-label").textContent      = tx.resultLabel;
  document.getElementById("retry-btn-text").textContent    = tx.retryBtn;
  document.getElementById("bgm-stop-btn-text").textContent = tx.bgmStopBtn;
  document.getElementById("share-btn-text").textContent    = tx.shareBtn;
}

/** 言語を切り替える（選択画面・トグルボタン共通） */
function setLang(lang, skipSave) {
  state.lang = lang;
  if (!skipSave) localStorage.setItem("mbti_lang", lang);
  applyLang();

  // クイズ中に言語を切り替えた場合、現在の設問を再描画する
  if (screens.quiz.classList.contains("active") && !state.isAnimating) {
    renderQuestion(true);
  }
}

/** 言語をトグルする（JA↔EN） */
function toggleLang() {
  setLang(state.lang === "ja" ? "en" : "ja");
}

// ===========================
// 初期化
// ===========================
function init() {
  // 保存済み言語を読み込む
  const saved = localStorage.getItem("mbti_lang");

  if (saved && I18N[saved]) {
    // 2回目以降: 言語選択画面をスキップしてスタート画面へ
    setLang(saved, true);
    showScreen("start");
  } else {
    // 初回: 言語選択画面を表示
    setLang("ja", true); // デフォルトは日本語でUIを一旦設定
    showScreen("lang");
  }

  // 言語選択画面のボタン
  el.langBtnJa.addEventListener("click", () => {
    setLang("ja");
    showScreen("start");
  });
  el.langBtnEn.addEventListener("click", () => {
    setLang("en");
    showScreen("start");
  });

  // 言語トグルボタン
  el.langToggle.addEventListener("click", toggleLang);

  // その他ボタン
  el.startBtn.addEventListener("click", startQuiz);
  el.retryBtn.addEventListener("click", retryQuiz);
  el.shareBtn.addEventListener("click", shareResult);
  el.bgmStopBtn.addEventListener("click", () => {
    stopBgm();
  });

  if (!SHOW_LETTERS_DURING_QUIZ) {
    el.letterDisplay.style.display = "none";
  }

  // キーボードショートカット（択数に応じて動的に対応）
  document.addEventListener("keydown", (e) => {
    if (!screens.quiz.classList.contains("active") || state.isAnimating) return;
    const q = quizData.questions[state.currentQuestion];
    const choiceOrder = getChoiceOrder(state.currentQuestion, q.choices.length);
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= q.choices.length) {
      selectChoice(choiceOrder[num - 1]);
    }
  });

  initParticles();
}

// ===========================
// 画面遷移
// ===========================
function showScreen(name) {
  Object.entries(screens).forEach(([key, scr]) => {
    scr.classList.toggle("active", key === name);
  });
}

// ===========================
// クイズ開始
// ===========================
function startQuiz() {
  state.currentQuestion = 0;
  state.chosenTexts = [];
  state.accumulatedLetters = "";
  state.choiceOrderByQuestion = {};

  stopBgm();

  el.letterDisplay.style.display = SHOW_LETTERS_DURING_QUIZ ? "flex" : "none";
  el.currentLetters.textContent = "—";

  showScreen("quiz");
  renderQuestion(true);
}

// ===========================
// 質問のレンダリング
// ===========================
function renderQuestion(isFirst = false) {
  const q = quizData.questions[state.currentQuestion];
  const choiceOrder = getChoiceOrder(state.currentQuestion, q.choices.length);
  const progress = (state.currentQuestion / quizData.questions.length) * 100;

  el.questionNumber.textContent = state.currentQuestion + 1;
  el.progressBar.style.width = `${progress}%`;
  el.progressPercent.textContent = `${Math.round(progress)}%`;

  const questionCard = document.querySelector(".question-card");
  questionCard.classList.remove("slide-in");

  requestAnimationFrame(() => {
    el.questionText.textContent = loc(q.text);

    if (SHOW_LETTERS_DURING_QUIZ) {
      el.currentLetters.textContent = state.accumulatedLetters || "—";
    }

    renderChoices(q, choiceOrder);
    updateKeyboardHint(q.choices.length);

    if (!isFirst) {
      questionCard.classList.add("slide-in");
    }
  });
}

/**
 * 配列を破壊せずにシャッフルしたコピーを返す（Fisher-Yates）
 * @param {number[]} arr
 */
function shuffledCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 質問ごとの選択肢表示順を取得（未生成なら生成）
 * @param {number} questionIndex
 * @param {number} choiceCount
 */
function getChoiceOrder(questionIndex, choiceCount) {
  if (!state.choiceOrderByQuestion[questionIndex]) {
    const base = Array.from({ length: choiceCount }, (_, i) => i);
    state.choiceOrderByQuestion[questionIndex] = shuffledCopy(base);
  }
  return state.choiceOrderByQuestion[questionIndex];
}

// ===========================
// 選択肢の動的レンダリング
// ===========================
function renderChoices(question, choiceOrder) {
  const container = el.choicesContainer;
  container.innerHTML = "";

  const hasMedia = question.choices.some(c => c.image || c.video);
  const isTwoCol = hasMedia && question.choices.length === 2;

  container.classList.toggle("choices--has-media", hasMedia);
  container.classList.toggle("choices--grid", isTwoCol);

  choiceOrder.forEach((choiceIndex, index) => {
    const choice = question.choices[choiceIndex];
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    if (hasMedia) btn.classList.add("choice-btn--media");
    btn.setAttribute("aria-label", t().choiceAriaLabel(index + 1));
    btn.dataset.index = choiceIndex;

    // メディア部分
    let mediaHtml = "";
    if (choice.video) {
      mediaHtml = `
        <div class="choice-media">
          <video src="${choice.video}" autoplay muted loop playsinline></video>
        </div>`;
    } else if (choice.image) {
      mediaHtml = `
        <div class="choice-media">
          <img src="${choice.image}" alt="" loading="lazy" />
        </div>`;
    }

    // テキスト部分
    btn.innerHTML = `
      ${mediaHtml}
      <div class="choice-inner">
        <span class="choice-num" aria-hidden="true">${index + 1}</span>
        <div class="choice-content">
          <span class="choice-text">${loc(choice.text)}</span>
        </div>
        <span class="choice-arrow" aria-hidden="true">›</span>
      </div>
    `;

    btn.addEventListener("click", () => selectChoice(choiceIndex));
    container.appendChild(btn);
  });
}

// ===========================
// キーボードヒントの更新
// ===========================
function updateKeyboardHint(choiceCount) {
  const tx = t();
  const keys = Array.from({ length: choiceCount }, (_, i) =>
    `<kbd class="key-badge">${i + 1}</kbd>`
  ).join(" / ");
  el.keyboardHint.innerHTML = `${tx.keyboardHintPrefix}${keys}${tx.keyboardHintSuffix}`;
}

// ===========================
// 選択肢を選ぶ
// ===========================
function selectChoice(index) {
  if (state.isAnimating) return;
  state.isAnimating = true;

  const q = quizData.questions[state.currentQuestion];
  const chosen = q.choices[index];
  const allBtns = el.choicesContainer.querySelectorAll(".choice-btn");

  const selectedBtn = Array.from(allBtns).find((btn) => Number(btn.dataset.index) === index);
  if (selectedBtn) selectedBtn.classList.add("selected");

  playClickSound();

  state.chosenTexts.push(loc(chosen.text));
  state.accumulatedLetters += chosen.letter;

  if (SHOW_LETTERS_DURING_QUIZ) {
    animateLetterAdd(chosen.letter);
  }

  setTimeout(() => {
    state.currentQuestion++;
    if (state.currentQuestion >= quizData.questions.length) {
      showResult();
    } else {
      renderQuestion();
      setTimeout(() => { state.isAnimating = false; }, 400);
    }
  }, 500);
}

// ===========================
// アルファベット追加アニメーション（表示モード時のみ）
// ===========================
function animateLetterAdd(letter) {
  const badge = document.createElement("span");
  badge.className = "letter-pop";
  badge.textContent = `+${letter}`;
  el.letterDisplay.appendChild(badge);

  setTimeout(() => {
    badge.remove();
    el.currentLetters.textContent = state.accumulatedLetters;
  }, 500);
}

// ===========================
// 結果表示
// ===========================
function showResult() {
  const typeCode = state.accumulatedLetters;

  el.resultType.textContent = typeCode;
  updateResultPortrait(typeCode);

  // CHARLIE KIRK パターンにマッチしたときは説明文を固定
  const isCharlieKirk = bgmRules.some(rule => {
    try { return new RegExp(rule.pattern).test(typeCode) && rule.audio.includes("charlie-kirk"); }
    catch { return false; }
  });
  el.resultDescription.textContent = isCharlieKirk
    ? "We Are Charlie Kirk"
    : t().resultDesc(state.chosenTexts);

  // BGMチェック
  checkAndPlayBgm(typeCode);

  showScreen("result");
  state.isAnimating = false;

  setTimeout(() => {
    document.querySelector(".result-card").classList.add("revealed");
  }, 100);
}

/**
 * 比較しやすいように大文字A-Zのみを抽出
 * @param {string} value
 */
function normalizeCode(value) {
  return (value || "").toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Levenshtein距離
 * @param {string} a
 * @param {string} b
 */
function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

/**
 * typeCode と CHARLIE KIRK の近さを 0~1 で返す
 * @param {string} typeCode
 */
function calculateCharlieSimilarity(typeCode) {
  const normalizedType = normalizeCode(typeCode);
  if (!normalizedType) return 0;

  const distance = levenshteinDistance(normalizedType, CHARLIE_TARGET);
  const maxLen = Math.max(normalizedType.length, CHARLIE_TARGET.length);
  if (maxLen === 0) return 0;

  const similarity = 1 - distance / maxLen;
  return Math.max(0, Math.min(1, similarity));
}

/**
 * CHARLIE KIRK への近さに応じて画像のブラー量を更新
 * @param {string} typeCode
 */
function updateResultPortrait(typeCode) {
  if (!el.resultPortrait) return;

  const similarity = calculateCharlieSimilarity(typeCode);
  const blurPx = (1 - similarity) * MAX_PORTRAIT_BLUR_PX;
  const opacity = 0.45 + similarity * 0.55;

  el.resultPortrait.style.setProperty("--portrait-blur", `${blurPx.toFixed(2)}px`);
  el.resultPortrait.style.setProperty("--portrait-opacity", opacity.toFixed(2));
}

// ===========================
// BGMチェック & 再生
// ===========================
function checkAndPlayBgm(typeCode) {
  if (!bgmRules || bgmRules.length === 0) return;

  for (const rule of bgmRules) {
    try {
      if (new RegExp(rule.pattern).test(typeCode)) {
        playBgm(rule.audio);
        return;
      }
    } catch (e) {
      console.warn(`BGMルールの正規表現エラー: "${rule.pattern}"`, e);
    }
  }
}

function playBgm(src) {
  stopBgm();

  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.6;

  // 読み込み中でも stopBgm() で止められるよう、生成直後に登録する
  state.bgmAudio = audio;

  audio.addEventListener("canplaythrough", () => {
    // すでに別の stopBgm() で差し替えられていたら再生しない
    if (state.bgmAudio !== audio) return;

    audio.play().then(() => {
      showBgmIndicator(src);
    }).catch(err => {
      // ブラウザのAutoplay制限などで再生できない場合
      console.warn("BGM再生エラー:", err);
      if (state.bgmAudio === audio) state.bgmAudio = null;
    });
  });

  audio.addEventListener("error", () => {
    console.warn("BGMファイルが見つかりません:", src);
    if (state.bgmAudio === audio) state.bgmAudio = null;
  });

  // ファイルの読み込みを開始
  audio.load();
}

function stopBgm() {
  if (state.bgmAudio) {
    state.bgmAudio.pause();
    state.bgmAudio.currentTime = 0;
    state.bgmAudio = null;
  }
  hideBgmIndicator();
}

function showBgmIndicator(src) {
  // ポップアウト表示なし（BGM停止ボタンのみ表示）
  el.bgmStopBtn.style.display = "inline-flex";
  el.bgmIndicator.onclick = () => stopBgm();
}

function hideBgmIndicator() {
  el.bgmStopBtn.style.display = "none";
}

// ===========================
// やり直し
// ===========================
function retryQuiz() {
  stopBgm();
  document.querySelector(".result-card").classList.remove("revealed");
  el.resultType.textContent = "";
  el.resultDescription.textContent = "";
  updateResultPortrait("");
  showScreen("start");
}

// ===========================
// シェア機能
// ===========================
function shareResult() {
  const tx = t();
  const typeCode = state.accumulatedLetters;
  const desc = el.resultDescription.textContent;
  const text = tx.shareText(typeCode, desc);

  if (navigator.share) {
    navigator.share({ title: tx.shareTitle, text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      const btn = el.shareBtn;
      const original = btn.innerHTML;
      btn.innerHTML = `<span>${tx.copiedMsg}</span>`;
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    });
  }
}

// ===========================
// 選択肢クリック効果音
// ===========================
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

/** Web Audio API による合成音（フォールバック用） */
function playSynthClick() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) { /* 無音で続行 */ }
}

/**
 * clickSounds 配列にファイルがあればランダムに1つ再生。
 * 空またはエラー時は合成音にフォールバック。
 */
function playClickSound() {
  // clickSounds は data.js で定義
  if (typeof clickSounds !== "undefined" && clickSounds.length > 0) {
    const src = clickSounds[Math.floor(Math.random() * clickSounds.length)];
    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(() => playSynthClick()); // 読み込み失敗時はフォールバック
  } else {
    playSynthClick();
  }
}

// ===========================
// パーティクル背景
// ===========================
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  draw();
}

// ===========================
// アプリ起動
// ===========================
document.addEventListener("DOMContentLoaded", init);

if (el.resultPortrait) {
  el.resultPortrait.addEventListener("error", () => {
    el.resultPortrait.classList.add("is-hidden");
  });
}