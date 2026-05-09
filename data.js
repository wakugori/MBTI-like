// ============================================================
//  設定 (Config)
// ============================================================

// クイズ中にアルファベットを表示するか
//   false = 最後まで隠す ← 笑いのポイント（推奨）
//   true  = リアルタイムで表示する
const SHOW_LETTERS_DURING_QUIZ = true;


// ============================================================
//  BGMルール (bgmRules)
//
//  結果のタイプコードに対して正規表現でマッチし、
//  最初にマッチしたルールのBGMが流れます。
//
//  pattern: 正規表現文字列 (typeCodeに対して new RegExp(pattern).test() を実行)
//  audio:   音声ファイルのパス (audio/ フォルダに置いてください)
//
//  ★ 例: タイプコードが "CHARLIE KIRK" で始まる場合に we-are-charlie-kirk-song.mp3 を流す
// ============================================================

// ============================================================
//  選択肢クリック効果音 (clickSounds)
//
//  選択肢をクリックするたびに、このリストからランダムに1つ再生されます。
//  audio/ フォルダに mp3 ファイルを置き、パスをここに追加してください。
//
//  ★ 空配列 [] にすると合成音（ピコ音）にフォールバックします
//  ★ 1つだけ指定すれば常にそれが再生されます
//  ★ 複数指定するとランダムに選ばれます
// ============================================================

// 選択肢選択時の効果音。
// 以下のものがランダムに再生される
// 鬱陶しいのでコメントアウト中
const clickSounds = [
//  "audio/great.wav",
//  "audio/bang.wav",
//  "audio/counting.wav",
];


// ============================================================
//  BGMルール (bgmRules)
const bgmRules = [
  { pattern: "CHARLIE-KIRK", audio: "audio/we-are-charlie-kirk-song.mp3" },
  { pattern: "NIULNI", audio: "audio/another.mp3" },
  // 必要に応じてルールを追加してください
  // { pattern: ".*FOO.*", audio: "audio/foo.mp3" },
];


// ============================================================
//  質問データ (quizData)
//
//  ★ テキストは { ja: "日本語", en: "English" } オブジェクトで書くと
//    言語切替に対応します。文字列のまま書いても動作します（常にその文字列を表示）。
//
//  ★ 選択肢は2択でも3択でも何択でもOKです
//    choicesの配列に追加するだけで自動的に増えます
//
//  各選択肢のフィールド:
//    text   : 選択肢テキスト。{ ja, en } または文字列（必須）
//    letter : タイプコードに追加されるアルファベット（必須）
//             ★ ここを変えると最終タイプが変わります
//    image  : 画像のパス（省略可）例: "img/choice1.jpg"
//    video  : 動画のパス（省略可）例: "video/choice1.mp4"
//             ※ imageとvideoは同時に指定しないこと（videoが優先されます）
// ============================================================

const quizData = {
  title: {
    ja: "あなたの隠れた本質を暴く診断",
    en: "Reveal Your Hidden Personality",
  },
  subtitle: {
    ja: "正直に答えてください。あなたの本当の姿が明らかになります。",
    en: "Answer honestly. Your true self will be revealed.",
  },

  questions: [

    {
      id:1 ,
      text: {
        ja: "休日の過ごし方として、最も自分らしいのは？",
        en: "Which best describes how you spend your days off?",
      },
      choices: [
        {
          text: { ja: "ジムで体を鍛えながら、なぜ今の若者は努力をしないのかについて考える", en: "I go to the gym and work out, and I think about why young people today don't put in the effort." },
          letter: "C",
        },
        {
          text: { ja: "家でゆっくり読書や映画を楽しむ", en: " I enjoy reading or watching movies at home" },
          letter: "I",
        },
        {
          text: { ja: "友人や家族と外出して賑やかに過ごす", en: "I go out with friends and family" },
          letter: "O",
        },
        
        {
          text: { ja: "新しいスキルや知識を学ぶ時間にあてる", en: "I spend time learning new skills" },
          letter: "J",
        },
      ]
    },

    {
      id: 2 ,
      text: {
        ja: "重要な決断をするとき、あなたはどうする？",
        en: "How do you approach important decisions?",
      },
      choices: [
        {
          text: { ja: "迷いは弱さ。伝統と常識に従い即断する", en: "Hesitation is weakness.  I follow tradition and decide immediately." },
          letter: "H",
        },
        {
          text: { ja: "データや情報を徹底的に調べてから判断する", en: "I research thoroughly before deciding" },
          letter: "D",
        },
        {
          text: { ja: "信頼できる人に相談してから決める", en: "I consult people I trust" },
          letter: "O",
        },
        {
          text: { ja: "どれでもない、その日の気分で", en: "None of these — I decide on the day" },
          letter: "Z",
        }

      ]
    },

    // ─── 2択の例（画像付き）────────────────────────────────
    // ※ 画像ファイルを img/ フォルダに置いてから使ってください
    {
      id:3 ,
      text: {
        ja: "ストレスを感じたとき、どう対処する？",
        en: "How do you handle stress?",
      },
      choices: [
        {
          text: { ja: "もっと働く。ストレスは努力が足りない証拠だ", en: "I work harder. Stress means you're not working hard ENOUGH" },
          letter: "A",
          // image: "img/story.jpg"
        },
        {
          text: { ja: "趣味に没頭して気分転換する", en: " I throw myself into a hobby" },
          letter: "S",
          // image: "img/idea.jpg"
        },
        {
          text: { ja: "一人で散歩したり、自然の中でリフレッシュする", en: "I take walks alone or spend time in nature" },
          letter: "N",
          // image: "img/story.jpg"
        },
        {
          text: { ja: "友人に話を聞いてもらい、気持ちを共有する", en: "I talk to friends and share my feelings" },
          letter: "T",
          // image: "img/story.jpg"
        }
      ]
    },

    // ─── 2択の例（動画付き）────────────────────────────────
    // ※ 動画ファイルを video/ フォルダに置いてから使ってください
    {
      id:4 ,
      text: {
        ja: "自分の長所として最もあてはまるのは？",
        en: "Which best describes your greatest strength?",
      },
      choices: [
        {
          text: { ja: "何があっても信念を曲げない不屈の意志", en: "I'm a man of conviction" },
          letter: "R",
          // video: "video/test.mp4"
        },
        {
          text: { ja: "相手の気持ちに寄り添える共感力", en: "Empathy — I can understand how others feel" },
          letter: "E",
        },
        {
          text: { ja: "どんな状況でも冷静に分析できる論理力", en: "Logic — I stay calm and analytical in any situation" },
          letter: "L",
        },
        {
          text: { ja: "新しいアイデアを生み出す創造力", en: "Creativity — I constantly generate new ideas" },
          letter: "C",
        }
      ]
    },

    {
      id:5,
      text: {
        ja: "友人があなたに悩みを相談してきました。あなたはどうする？",
        en: "A friend comes to you with a personal problem. What do you do?",
      },
      choices: [
        {
          text: { ja: "「それは自己責任だ」と、優しく、しかしはっきりと伝える", en: "I tell them — kindly but clearly — that this is a PERSONAL RESPONSIBILITY issue" },
          letter: "L",
        },
        {
          text: { ja: "じっくり話を聞いて、まず共感することを大切にする", en: "I listen carefully and make sure they feel heard and understood" },
          letter: "F",
        },
        {
          text: { ja: "一緒に解決策を考え、具体的なアドバイスをする", en: "I help them think through solutions and give concrete advice" },
          letter: "C",
        },
        {
          text: { ja: "客観的な視点で状況を整理し、問題の本質を伝える", en: "I step back, assess the situation objectively, and tell them what I really see" },
          letter: "O",
        },
      ]
    },

    {
      id:6 ,
      text: {
        ja: "理想のリーダー像に最も近いのは？",
        en: "Which best describes your ideal leader?",
      },
      choices: [
        {
          text: { ja: "批判されるほど正しさが証明される、強い信念の持ち主", en: "Someone whose convictions grow STRONGER the more they're attacked" },
          letter: "I",
        },
        {
          text: { ja: "現場の声をよく聞き、全員の合意を大切にする人", en: "Someone who listens and builds consensus" },
          letter: "B",
        },
        {
          text: { ja: "期的なビジョンを持ち、変化を恐れない人", en: "Someone with a bold long-term vision" },
          letter: "C",
        },
        {
          text: { ja: "理的で冷静、感情に流されない判断ができる人", en: "Someone rational and cool-headed under pressure" },
          letter: "D",
        },
      ]
    },

    {
      id:7 ,
      text:{
        ja:"あなたが最も共感するフレーズは？",
        en:"Which phrase resonates with you the most?",
      },
      choices:[
        {
          text:{ ja:"事実はお前の感情なんか気にかけない", en:"Facts don't care about your feelings"},
          letter: "E",
        },
        {
          text:{ ja:"世界はもっと良くなれる", en:"The world can be better"},
          letter: "B",
        },
        {
          text:{ ja:"バランスと対話が大切だ", en:"Balance and dialogue matter"},
          letter: "D",
        },
        {
          text:{ ja:"力なき正義は無能であり、正義なき力は圧制である", en:"Justice without force is powerless; force without justice is tyrannical"},
          letter: "P",
        },
      ]
    },


    {
      id:8 ,
      text:{
        ja:"大学教育についてどう思いますか？",
        en:"What’s your take on college education?",
      },
      choices:[
        {
          text:{ ja:"多額の学費を払って共産主義者の教授に反米思想を叩き込まれる洗脳施設となっている", en:"College education is now just expensive anti-American brainwashing led by communist professors"},
          letter: "-",
        },
        {
          text:{ ja:"専門的知識と多様な考え方を学ぶに重要な場", en:"College is an essential place for acquiring specialized knowledge and diverse perspectives."},
          letter: "R",
        },
        {
          text:{ ja:"学問の自由と批判的志向を育てる民主主義に不可欠な場", en:"College is essential institutions for democracy, fostering academic freedom and a spirit of critical inquiry."},
          letter: "L",
        },
        {
          text:{ ja:"費用と目的を考えれば、職業訓練や独学の方が合理的な場合がある", en:"Vocational training or self-study may sometimes be a more sensible option than college"},
          letter: "C",
        },
      ]
    },

    {
      id:9 ,
      text: {
        ja: "女性とは何ですか？",
        en: "What is 'Woman'?",
      },
      choices: [
        {
          text: { ja: "XXの染色体を持つ人", en: "A person with XX chromosomes " },
          letter: "K",
        },
        {
          text: { ja: "女性と自認している人", en: "A person who identifies as a woman" },
          letter: "L",
        },
      ]
    },




    {
      id:10 ,
      text:{
        ja:"まじめに働く納税者がジェンダー学専攻の学生ローンを強制的に肩代わりすべきですか？",
        en:"",
      },
      choices:[
        {
          text:{ ja:"自分で選んだプロパガンダ専攻のローンは自分で払え。納税者には一切関係ない", en:"You chose the lefty propagandist degree, You pay for it. Hardworking taxpayers owe you nothing"},
          letter: "I",
        },
        {
          text:{ ja:"はい。高等教育への投資は社会全体に恩恵をもたらすと思う", en:"Yes — investing in higher education benefits society as a whole"},
          letter: "I",
        },
        {
          text:{ ja:"一部は支援すべきだが、専攻や収入に応じた条件は必要だと思う", en:"Partially — but eligibility should depend on major and income level"},
          letter: "P",
        },
        {
          text:{ ja:"借りた本人が返すべきだが、金利の引き下げなど制度改善は必要だ", en:"Borrowers should repay their own debt, but we need reform on interest rates"},
          letter: "R",
        },
      ]
    },

    {
      id:11 ,
      text:{
        ja:"テイラー・スウィフトについて、どう思いますか？",
        en:"What do you think of Taylor Swift?",
      },
      choices:[
        {
          text:{ ja:"彼女はディープステートによって、若い有権者を操らせるために使われている", en:"She's being WEAPONIZED by the deep state to manipulate young voters"},
          letter: "R",
        },
        {
          text:{ ja:"音楽もビジネスも一流で、現代最大のポップスターだと思う", en:"he's a once-in-a-generation pop star — the music and business are both brilliant"},
          letter: "G",
        },
        {
          text:{ ja:"音楽は好きだけど、最近の政治的発言は余計だと思う", en:"Love the music, but I wish she'd stay out of politics"},
          letter: "D",
        },
        {
          text:{ ja:"特に興味はないが、影響力があるのは事実だと思う", en:" Not my thing, but I acknowledge her massive cultural influence"},
          letter: "U",
        },
      ]
    },

    {
      id:12 ,
      text:{
        ja:"中絶は殺人ですか？",
        en:"Is abortion murder?",
      },
      choices:[
        {
          text:{ ja:"中絶は殺人という神への背信行為であり、禁じられるべきだ", en:"Abortion is an act of betrayal against God and amounts to murder; therefore, it should be prohibited"},
          letter: "K",
        },
        {
          text:{ ja:"中絶は殺人だが、権利として認められるべきだ", en:"Abortion is not murder; it is a woman’s right and should therefore be defended"},
          letter: "R",
        },
        {
          text:{ ja:"中絶は殺人でなく、女性の権利であるため、擁護されるべきだ", en:"Abortion is murder, but it should be recognized as a right"},
          letter: "L",
        },
        {
          text:{ ja:"中絶が殺人かどうかはその中絶の必要性によって変わる", en:"Whether abortion is murder depends on the necessity of the procedure"},
          letter: "C",
        },
      ]
    },

  ]
      

  
};