// ===========================
// 多言語対応テキスト (i18n)
// ===========================

const I18N = {
  ja: {
    // メタ
    htmlLang: "ja",
    pageTitle: "性格診断 — あなたの隠れた本質を暴く",

    // 言語選択画面
    langSelectTitle: "言語を選択してください",
    langSelectSub: "Select your language",

    // スタート画面
    logoBadge: "Personality Type Analyzer",
    startTitle: "あなたの<br>隠れた本質を<br>暴く診断",
    startSubtitle: "直感で答えてください。<br>選択肢があなたの性格タイプを形作っていきます。",
    statLabelQ: "問",
    statLabelChoices: "択",
    statLabelEach: "各問",
    statLabelTime: "所要時間",
    statTime: "約2分",
    startBtn: "診断スタート",
    startNote: "※ 個人情報の収集はありません",

    // クイズ画面
    letterLabel: "あなたのタイプ",
    keyboardHintPrefix: "キーボード: ",
    keyboardHintSuffix: " で選択",
    choiceAriaLabel: (n) => `選択肢${n}を選ぶ`,

    // BGMインジケーター
    bgmLabel: "BGM再生中:",

    // 結果画面
    resultLabel: "あなたの性格タイプ",
    retryBtn: "もう一度やる",
    bgmStopBtn: "BGM停止",
    shareBtn: "結果をシェア",
    shareText: (typeCode, desc) =>
      `【性格診断結果】\nタイプ: ${typeCode}\n\n${desc}\n\nあなたも試してみて！`,
    copiedMsg: "✓ コピーしました！",
    shareTitle: "性格診断結果",

    // 結果文生成
    resultDesc: (texts) => {
      const parts = texts.map((t, i) =>
        i === texts.length - 1 ? `「${t}」な` : `「${t}」で、`
      );
      return `あなたは${parts.join("")}人間です！`;
    },
  },

  en: {
    // Meta
    htmlLang: "en",
    pageTitle: "Personality Quiz — Reveal Your Hidden Self",

    // Language select
    langSelectTitle: "Select your language",
    langSelectSub: "言語を選択してください",

    // Start screen
    logoBadge: "Personality Type Analyzer",
    startTitle: "Reveal Your<br>Hidden<br>Personality",
    startSubtitle: "Trust your instincts.<br>Your choices will shape your personality type.",
    statLabelQ: "Q",
    statLabelChoices: "choices",
    statLabelEach: "per Q",
    statLabelTime: "~2 min",
    statTime: "",
    startBtn: "Start Quiz",
    startNote: "* No personal data is collected",

    // Quiz screen
    letterLabel: "Your Type",
    keyboardHintPrefix: "Keyboard: ",
    keyboardHintSuffix: " to select",
    choiceAriaLabel: (n) => `Select choice ${n}`,

    // BGM indicator
    bgmLabel: "Playing BGM:",

    // Result screen
    resultLabel: "Your Personality Type",
    retryBtn: "Try Again",
    bgmStopBtn: "Stop BGM",
    shareBtn: "Share Result",
    shareText: (typeCode, desc) =>
      `[Personality Quiz Result]\nType: ${typeCode}\n\n${desc}\n\nTry it yourself!`,
    copiedMsg: "✓ Copied!",
    shareTitle: "Personality Quiz Result",

    // Result description builder
    resultDesc: (texts) => {
      const parts = texts.map((t, i) =>
        i === texts.length - 1 ? `"${t}"` : `"${t}",`
      );
      return `You are a person who is ${parts.join(" ")}!`;
    },
  },
};
