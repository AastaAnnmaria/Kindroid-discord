export interface ToeicQuestion {
  id: string;
  type: "multiple_choice" | "cloze";
  question: string;
  options: [string, string, string, string];
  correctAnswer: "A" | "B" | "C" | "D";
  grammarPattern: string;
  explanation: string;
}

export const toeicQuestions: ToeicQuestion[] = [
  // ── Conditionals ──────────────────────────────────────────────────────────
  {
    id: "cond_01",
    type: "cloze",
    question:
      "If I _____ the CEO of this company, I would implement a four-day workweek immediately.",
    options: ["am", "were", "have been", "had been"],
    correctAnswer: "B",
    grammarPattern: "第二類假設語氣（Type 2 Conditional）",
    explanation:
      "第二類假設語氣表示與現在或未來事實相反的假設。If 子句用過去式，be 動詞一律用 were（不論人稱）。主句用 would + 原形動詞。",
  },
  {
    id: "cond_02",
    type: "cloze",
    question:
      "If the project manager _____ the deadline properly, we wouldn't have missed it.",
    options: ["planned", "has planned", "had planned", "would plan"],
    correctAnswer: "C",
    grammarPattern: "第三類假設語氣（Type 3 Conditional）",
    explanation:
      "第三類假設語氣表示與過去事實相反的假設。If 子句用過去完成式（had + p.p.），主句用 would have + p.p.。",
  },
  {
    id: "cond_03",
    type: "cloze",
    question:
      "If you _____ the training program last year, you would be more qualified for this promotion now.",
    options: ["complete", "completed", "had completed", "have completed"],
    correctAnswer: "C",
    grammarPattern: "混合條件句（Mixed Conditional）",
    explanation:
      "混合條件句：If 子句指過去（had + p.p.），主句指現在（would + 原形）。表示「過去的假設對現在造成的影響」。",
  },
  {
    id: "cond_04",
    type: "cloze",
    question:
      "If the headquarters _____ to relocate to Shanghai, many employees would face difficult decisions.",
    options: ["is", "was", "were", "had been"],
    correctAnswer: "C",
    grammarPattern: "If + were to（正式假設未來）",
    explanation:
      "「If + 主詞 + were to + 原形動詞」用於正式語境中假設未來發生的事情，語氣比一般第二類條件句更正式，常見於商業文書。",
  },

  // ── Inversion after If-omission ───────────────────────────────────────────
  {
    id: "inv_01",
    type: "cloze",
    question:
      "_____ you require any further information, please do not hesitate to contact our customer service team.",
    options: ["If", "Should", "Were", "Had"],
    correctAnswer: "B",
    grammarPattern: "Should 引導的假設句（省略 if 的倒裝）",
    explanation:
      "「Should you...」是省略 if 的倒裝條件句，等於「If you should...」，語氣正式，常見於商業信函與電子郵件。",
  },
  {
    id: "inv_02",
    type: "cloze",
    question:
      "_____ the finance team identified the accounting error earlier, the company could have avoided the penalty.",
    options: ["If", "Should", "Had", "Were"],
    correctAnswer: "C",
    grammarPattern: "Had 引導的假設句（省略 if 的過去完成倒裝）",
    explanation:
      "「Had + 主詞 + p.p.」是省略 if 的過去完成式倒裝，等於「If ... had + p.p.」，為第三類條件句的正式書面寫法。",
  },

  // ── Negative Inversion ────────────────────────────────────────────────────
  {
    id: "inv_03",
    type: "cloze",
    question:
      "No sooner _____ the quarterly report than the shareholders demanded an emergency meeting.",
    options: [
      "was released",
      "had the report been released",
      "has been released",
      "is released",
    ],
    correctAnswer: "B",
    grammarPattern: "No sooner...than 倒裝句",
    explanation:
      "「No sooner...than」表示「一…就…」。否定副詞 no sooner 置於句首時，主句需倒裝（助動詞提前），且用過去完成式 had been。than 後接過去式。",
  },
  {
    id: "inv_04",
    type: "cloze",
    question:
      "Only after the contract was signed _____ the details of the acquisition.",
    options: [
      "we discussed",
      "did we discuss",
      "we had discussed",
      "have we discussed",
    ],
    correctAnswer: "B",
    grammarPattern: "Only + 副詞片語倒裝",
    explanation:
      "「Only + 時間/條件副詞片語」置於句首時，主句需倒裝（助動詞 + 主詞）。此句為過去事件，故用 did + 主詞 + 原形動詞。",
  },
  {
    id: "inv_05",
    type: "cloze",
    question:
      "_____ the senior partner attend client meetings in person; he usually delegates to associates.",
    options: [
      "Seldom does",
      "Seldom he does",
      "Does seldom",
      "Seldom he",
    ],
    correctAnswer: "A",
    grammarPattern: "Seldom/Rarely 引起的倒裝",
    explanation:
      "否定副詞 seldom/rarely/never/hardly 置於句首時，主句需倒裝。描述一般習慣用現在式，故為「Seldom does + 主詞 + 原形動詞」。",
  },
  {
    id: "inv_06",
    type: "cloze",
    question:
      "Not only _____ the deadline, but they also exceeded the client's expectations.",
    options: [
      "the team met",
      "did the team meet",
      "the team did meet",
      "met the team",
    ],
    correctAnswer: "B",
    grammarPattern: "Not only...but also 倒裝句",
    explanation:
      "「Not only」置於句首時，所在子句需倒裝（助動詞 + 主詞），用 did + 主詞 + 原形。but also 後的子句不倒裝。",
  },

  // ── Subjunctive Mood ──────────────────────────────────────────────────────
  {
    id: "subj_01",
    type: "cloze",
    question:
      "The board of directors recommended that the CEO _____ a comprehensive restructuring plan.",
    options: ["submits", "submitted", "submit", "would submit"],
    correctAnswer: "C",
    grammarPattern: "命令式虛擬語氣（Mandative Subjunctive）",
    explanation:
      "在 recommend / suggest / insist / demand / require 等動詞後的 that 子句中，動詞必須用原形（不加 -s，不用助動詞），這稱為命令式虛擬語氣。",
  },
  {
    id: "subj_02",
    type: "cloze",
    question:
      "It is essential that every employee _____ the updated safety protocols.",
    options: ["follows", "follow", "is following", "will follow"],
    correctAnswer: "B",
    grammarPattern: "It is + 形容詞 + that + 虛擬語氣",
    explanation:
      "在 It is essential / important / necessary / vital + that 後的子句中，動詞用原形（虛擬語氣），不加 -s，也不用助動詞。",
  },

  // ── Wish Constructions ────────────────────────────────────────────────────
  {
    id: "wish_01",
    type: "cloze",
    question:
      "I wish I _____ speak Japanese fluently for the upcoming Tokyo conference.",
    options: ["can", "could", "would", "may"],
    correctAnswer: "B",
    grammarPattern: "Wish + 過去式（對現在的遺憾）",
    explanation:
      "「wish + 過去式」表示對現在情況的遺憾。能力用 could（而非 can），因為 wish 後接虛擬語氣，動詞退後一個時態。",
  },
  {
    id: "wish_02",
    type: "cloze",
    question:
      "The marketing director wishes she _____ more budget for the campaign last quarter.",
    options: ["had", "has had", "had had", "would have"],
    correctAnswer: "C",
    grammarPattern: "Wish + 過去完成式（對過去的遺憾）",
    explanation:
      "「wish + 過去完成式（had + p.p.）」表示對過去已發生事情的遺憾，表示當時本希望不同但已無法改變。",
  },
  {
    id: "wish_03",
    type: "cloze",
    question:
      "The employees wish the company _____ remote work options permanently.",
    options: ["offers", "offered", "will offer", "has offered"],
    correctAnswer: "B",
    grammarPattern: "Wish + 過去式（對現在的遺憾）",
    explanation:
      "wish 後接虛擬語氣，表示對現在狀況的遺憾時用過去式。此句表示員工希望公司（現在）能提供，但實際上沒有。",
  },

  // ── As if / As though ─────────────────────────────────────────────────────
  {
    id: "asif_01",
    type: "cloze",
    question:
      "The new intern acts as if he _____ the company for years.",
    options: ["works", "worked", "has worked", "is working"],
    correctAnswer: "B",
    grammarPattern: "As if / As though + 虛擬語氣（與現在相反）",
    explanation:
      "「as if/as though」後接虛擬語氣：與現在事實相反用過去式，與過去事實相反用過去完成式。此句表示他其實沒有做很多年。",
  },
  {
    id: "asif_02",
    type: "cloze",
    question:
      "The manager spoke to the team as if the project _____ already failed.",
    options: ["had", "has", "had had", "would have"],
    correctAnswer: "C",
    grammarPattern: "As if + 過去完成式（與過去事實相反）",
    explanation:
      "「as if + 過去完成式」表示說話時間點之前的虛擬假設情境，此句意指專案其實並未失敗，但他說話的語氣好像已經失敗了。",
  },

  // ── Relative Clauses ──────────────────────────────────────────────────────
  {
    id: "rel_01",
    type: "cloze",
    question:
      "The proposal, _____ was submitted last week, has been approved by the board.",
    options: ["that", "which", "who", "what"],
    correctAnswer: "B",
    grammarPattern: "非限制性關係子句（Non-defining Relative Clause）",
    explanation:
      "逗號後的非限制性關係子句（補充說明）只能用 which，不能用 that。that 只用於無逗號的限制性關係子句（定義性）。",
  },
  {
    id: "rel_02",
    type: "cloze",
    question:
      "The director to _____ the report was addressed has already retired.",
    options: ["who", "whom", "which", "that"],
    correctAnswer: "B",
    grammarPattern: "介系詞 + 關係代名詞（Preposition + Relative Pronoun）",
    explanation:
      "介系詞後面必須接受格 whom（代人）或 which（代事物），不能接 who 或 that。此句 to whom = to that person。",
  },
  {
    id: "rel_03",
    type: "cloze",
    question:
      "We need to find a venue _____ can accommodate at least 500 guests.",
    options: ["which", "where", "whom", "what"],
    correctAnswer: "A",
    grammarPattern: "限制性關係子句 — 代替事物用 which/that",
    explanation:
      "關係代名詞 which/that 用於代替先行詞（名詞），此處 a venue 是名詞且在子句中作主詞，用 which（或 that）。where 引導地點副詞子句但不作主詞。",
  },

  // ── Participial Phrases ───────────────────────────────────────────────────
  {
    id: "part_01",
    type: "cloze",
    question:
      "_____ the financial report, the CFO discovered several discrepancies in the accounts.",
    options: ["Review", "Reviewed", "Reviewing", "Having review"],
    correctAnswer: "C",
    grammarPattern: "現在分詞片語（主動分詞構句）",
    explanation:
      "分詞構句中，若分詞的邏輯主詞與主句主詞相同，且表示主動動作，用現在分詞（V-ing）。此句 the CFO reviewing the report。",
  },
  {
    id: "part_02",
    type: "cloze",
    question:
      "_____ by the positive market response, the company decided to expand its product line.",
    options: [
      "Encouraged",
      "Encouraging",
      "Having encouraged",
      "To encourage",
    ],
    correctAnswer: "A",
    grammarPattern: "過去分詞片語（被動分詞構句）",
    explanation:
      "分詞構句表示被動意義時，用過去分詞（p.p.），完整形式為「Being encouraged by...」。此句公司是被激勵的一方。",
  },
  {
    id: "part_03",
    type: "cloze",
    question:
      "_____ the preliminary research, the team was ready to present their findings.",
    options: [
      "Completed",
      "Completing",
      "Having completed",
      "To have completed",
    ],
    correctAnswer: "C",
    grammarPattern: "完成分詞片語（Having + p.p.）",
    explanation:
      "「Having + p.p.」用於分詞構句，強調分詞動作發生在主句動作之前（先完成研究，才準備好發表）。",
  },

  // ── Perfect Tenses ────────────────────────────────────────────────────────
  {
    id: "perf_01",
    type: "multiple_choice",
    question:
      "Which sentence uses the correct tense? The company ___ its new headquarters last month.",
    options: [
      "A. has opened",
      "B. opened",
      "C. had opened",
      "D. was opening",
    ],
    correctAnswer: "B",
    grammarPattern: "現在完成式 vs 過去簡單式",
    explanation:
      "「last month」是明確的過去時間副詞，必須搭配過去簡單式。現在完成式不與 yesterday / last week / ago / in 2020 等明確過去時間副詞搭配。",
  },
  {
    id: "perf_02",
    type: "cloze",
    question:
      "The marketing team _____ their strategy three times this quarter.",
    options: ["revised", "revises", "has revised", "had revised"],
    correctAnswer: "C",
    grammarPattern: "現在完成式（與 this + 時間段搭配）",
    explanation:
      "「this quarter」是包含現在的時間段，應使用現在完成式（has/have + p.p.）表示在這段時間內發生的動作（結果影響現在）。",
  },
  {
    id: "perf_03",
    type: "cloze",
    question:
      "By the time the CEO arrived at the meeting, the team _____ the presentation.",
    options: ["finished", "has finished", "had finished", "finishes"],
    correctAnswer: "C",
    grammarPattern: "過去完成式（Past Perfect）",
    explanation:
      "「By the time + 過去式子句」表示在某過去時間點之前，主句動作已完成，故用過去完成式（had + p.p.）。",
  },

  // ── Passive Voice ─────────────────────────────────────────────────────────
  {
    id: "pass_01",
    type: "cloze",
    question:
      "The quarterly report _____ by the finance department every three months.",
    options: ["prepares", "is prepared", "has prepared", "preparing"],
    correctAnswer: "B",
    grammarPattern: "現在式被動語態（Present Passive）",
    explanation:
      "被動語態（be + p.p.）表示主詞是動作的接受者，而非執行者。此句 report 是被準備的對象，故用被動 is prepared。",
  },
  {
    id: "pass_02",
    type: "cloze",
    question:
      "The new software system _____ across all departments by the end of Q3.",
    options: [
      "will implement",
      "will be implemented",
      "implements",
      "is implementing",
    ],
    correctAnswer: "B",
    grammarPattern: "未來式被動語態（Future Passive）",
    explanation:
      "未來式被動語態為「will be + p.p.」。此句 software system 是被實施的對象，應用被動式。主動式 will implement 缺少受詞。",
  },

  // ── Modal + Perfect ────────────────────────────────────────────────────────
  {
    id: "modal_01",
    type: "cloze",
    question:
      "The shipping department _____ the client about the delay. The client is very upset now.",
    options: [
      "should notify",
      "should have notified",
      "must notify",
      "had to notify",
    ],
    correctAnswer: "B",
    grammarPattern: "Should have + p.p.（對過去的批評/遺憾）",
    explanation:
      "「should have + p.p.」表示過去本應做但未做的事，帶有批評或遺憾的意涵。此句暗示他們當時沒有通知客戶但本應該通知。",
  },
  {
    id: "modal_02",
    type: "cloze",
    question:
      "The server crashed unexpectedly. There _____ a software bug.",
    options: [
      "must be",
      "must have been",
      "should have been",
      "might be",
    ],
    correctAnswer: "B",
    grammarPattern: "Must have + p.p.（對過去的強烈推測）",
    explanation:
      "「must have + p.p.」表示對過去已發生事情的強烈推測（幾乎確定）。此句推測伺服器崩潰的原因是過去已存在的 bug。",
  },
  {
    id: "modal_03",
    type: "cloze",
    question:
      "With better planning, we _____ the project on time.",
    options: [
      "could complete",
      "could have completed",
      "can complete",
      "could be completed",
    ],
    correctAnswer: "B",
    grammarPattern: "Could have + p.p.（過去本可以但未實現）",
    explanation:
      "「could have + p.p.」表示過去本來能夠做到但實際上未能做到的事情，常用於表達遺憾或批評。",
  },

  // ── Gerund vs Infinitive ──────────────────────────────────────────────────
  {
    id: "gerund_01",
    type: "cloze",
    question:
      "The manager stopped _____ personal emails during work hours after receiving a warning.",
    options: ["to send", "send", "sending", "sent"],
    correctAnswer: "C",
    grammarPattern: "Stop + 動名詞 vs Stop + 不定詞",
    explanation:
      "「stop + V-ing」表示停止做某事；「stop + to V」表示停下來去做（另一件）事。此句意思是停止發送個人信件，故用 stop + gerund。",
  },
  {
    id: "gerund_02",
    type: "cloze",
    question:
      "Please remember _____ the client's files before leaving the office.",
    options: ["backing up", "back up", "to back up", "to backing up"],
    correctAnswer: "C",
    grammarPattern: "Remember + 不定詞 vs Remember + 動名詞",
    explanation:
      "「remember + to V」表示記得（將來）要做某事；「remember + V-ing」表示記得（過去）做過某事。此句是提醒記得要備份，故用不定詞。",
  },
  {
    id: "gerund_03",
    type: "cloze",
    question:
      "After much deliberation, the company decided _____ a new ERP system.",
    options: ["adopt", "adopting", "to adopt", "adopted"],
    correctAnswer: "C",
    grammarPattern: "Decide + 不定詞（to V）",
    explanation:
      "decide 後接不定詞（to V），而非動名詞（V-ing）。類似動詞還有 plan, choose, agree, refuse, expect, hope 等。",
  },

  // ── Causative ─────────────────────────────────────────────────────────────
  {
    id: "caus_01",
    type: "cloze",
    question:
      "The project manager had her team _____ the entire proposal before the board meeting.",
    options: ["to revise", "revised", "revise", "revising"],
    correctAnswer: "C",
    grammarPattern: "使役動詞 have + 受詞 + 原形動詞",
    explanation:
      "使役動詞 have/make + 受詞 + 原形動詞（不加 to）；get + 受詞 + to V；有被動含義時，have/get + 受詞 + p.p.。此句 team 是主動執行，故用原形。",
  },
  {
    id: "caus_02",
    type: "cloze",
    question:
      "We need to get the contracts _____ before the end of this month.",
    options: ["sign", "signing", "signed", "to sign"],
    correctAnswer: "C",
    grammarPattern: "Get + 受詞 + 過去分詞（被動使役）",
    explanation:
      "「get + 受詞 + p.p.」表示使（某物）被…（被動意義的使役）。此句合約是被簽署的，故用 get + 受詞 + p.p.（signed）。",
  },

  // ── Concessive / Contrast ─────────────────────────────────────────────────
  {
    id: "conc_01",
    type: "cloze",
    question:
      "_____ the economic downturn, the company managed to increase its market share.",
    options: ["Although", "Despite", "Even if", "However"],
    correctAnswer: "B",
    grammarPattern: "Despite / In spite of（介系詞）vs Although（連接詞）",
    explanation:
      "「Despite/In spite of」後接名詞片語；「although/even though」後接子句（主詞 + 動詞）。此處後接名詞 the economic downturn，故用 despite。",
  },

  // ── Condition Connectors ──────────────────────────────────────────────────
  {
    id: "conn_01",
    type: "cloze",
    question:
      "_____ the client confirms by Friday, we will have to postpone the project.",
    options: ["If", "Unless", "Until", "Whether"],
    correctAnswer: "B",
    grammarPattern: "Unless（除非）= If ... not",
    explanation:
      "「unless」等於「if ... not」，表示「除非…否則…」，引導表示否定條件的副詞子句，後接現在式表示未來條件。",
  },
  {
    id: "conn_02",
    type: "cloze",
    question:
      "We can proceed with the expansion plan _____ the bank approves our loan application.",
    options: ["as long as", "even though", "regardless of", "in case"],
    correctAnswer: "A",
    grammarPattern: "As long as / Provided that（條件連接詞）",
    explanation:
      "「as long as / provided that」表示「只要…」，引導條件子句。後接現在式表示未來條件（時間/條件副詞子句不用未來式）。",
  },
  {
    id: "conn_03",
    type: "cloze",
    question:
      "Please keep the emergency contact number handy _____ there is a problem during the installation.",
    options: ["in case of", "in case", "in the event", "if only"],
    correctAnswer: "B",
    grammarPattern: "In case（連接詞）vs In case of（介系詞）",
    explanation:
      "「in case」後接子句（主詞 + 動詞）；「in case of」後接名詞。此處後有完整子句 there is a problem，故用 in case。",
  },
  {
    id: "conn_04",
    type: "cloze",
    question:
      "_____ the market improves or not, we must proceed with our contingency plan.",
    options: ["If", "Whether", "Although", "Unless"],
    correctAnswer: "B",
    grammarPattern: "Whether...or not（不管…還是）",
    explanation:
      "「whether...or not」表示「不管…還是…」，強調兩種情況下結果相同。if...or not 較不自然，whether 更適合表達二選一的對立情況。",
  },

  // ── Result Clauses ─────────────────────────────────────────────────────────
  {
    id: "result_01",
    type: "cloze",
    question:
      "The presentation was _____ impressive that the client immediately agreed to sign the contract.",
    options: ["very", "too", "so", "such"],
    correctAnswer: "C",
    grammarPattern: "So + 形容詞/副詞 + that（結果子句）",
    explanation:
      "「so + 形容詞/副詞 + that」表示「如此…以至於…」；「such + (a/an +) 形容詞 + 名詞 + that」也表示結果，但修飾名詞。此處修飾形容詞 impressive，用 so。",
  },
  {
    id: "result_02",
    type: "cloze",
    question:
      "It was _____ a challenging project that the entire team worked overtime for two weeks.",
    options: ["so", "such", "too", "very"],
    correctAnswer: "B",
    grammarPattern: "Such + a/an + 形容詞 + 名詞 + that",
    explanation:
      "「such + a/an + 形容詞 + 可數單數名詞 + that」表示結果，修飾名詞用 such；修飾形容詞或副詞用 so。此處 a challenging project 是名詞片語，故用 such。",
  },
  {
    id: "result_03",
    type: "cloze",
    question:
      "The report is _____ complex to be understood without a technical background.",
    options: ["very", "so", "too", "enough"],
    correctAnswer: "C",
    grammarPattern: "Too + 形容詞 + to V（結果不定詞）",
    explanation:
      "「too + 形容詞 + to V」表示「太…以至於不能…」，含有否定結果的意涵。so...that 也表示結果但後接完整子句，too...to 後接不定詞。",
  },
  {
    id: "result_04",
    type: "cloze",
    question:
      "Is the budget _____ to cover all the expenses for the annual conference?",
    options: [
      "enough large",
      "large enough",
      "too large",
      "so large",
    ],
    correctAnswer: "B",
    grammarPattern: "形容詞 + enough + to V",
    explanation:
      "「enough」修飾形容詞時必須放在形容詞後面（large enough），不是前面（enough large）。「形容詞 + enough + to V」表示「足夠…去做…」。",
  },

  // ── Cleft Sentences ───────────────────────────────────────────────────────
  {
    id: "cleft_01",
    type: "cloze",
    question:
      "_____ the outstanding customer service that won the company the annual award.",
    options: ["It was", "There was", "That was", "What was"],
    correctAnswer: "A",
    grammarPattern: "It 分裂句（It-cleft Sentence）",
    explanation:
      "「It is/was + 強調部分 + that/who + 其餘句子」是分裂句結構，用來強調某個句子成分。此句強調 the outstanding customer service。",
  },

  // ── Emphatic Do ────────────────────────────────────────────────────────────
  {
    id: "emph_01",
    type: "cloze",
    question:
      "Despite the challenges, the sales team _____ achieve their targets last quarter.",
    options: ["does", "did", "had", "was"],
    correctAnswer: "B",
    grammarPattern: "強調助動詞 do/does/did",
    explanation:
      "「did + 原形動詞」是強調過去式，用來強調事實確實發生，常用於與預期相反或強調肯定的語境。此句強調「確實達到」，故用強調助動詞 did。",
  },

  // ── Rather than ───────────────────────────────────────────────────────────
  {
    id: "rath_01",
    type: "cloze",
    question:
      "The CEO decided to expand into the Asian market _____ focus solely on domestic sales.",
    options: ["instead", "rather than", "other than", "more than"],
    correctAnswer: "B",
    grammarPattern: "Rather than（而非）",
    explanation:
      "「rather than」表示「而非/與其…不如」，後接平行結構（此句兩個動詞同為原形：expand...rather than focus）。instead 後不直接接動詞原形。",
  },

  // ── Articles ──────────────────────────────────────────────────────────────
  {
    id: "art_01",
    type: "cloze",
    question:
      "She was elected _____ chairperson of the committee unanimously.",
    options: ["a", "an", "the", "(no article)"],
    correctAnswer: "D",
    grammarPattern: "補語前冠詞省略（Title as Complement）",
    explanation:
      "在 elect/appoint/name/designate 等動詞後，補語表示職位或頭銜時，通常省略冠詞，尤其是當職位被視為唯一角色時。",
  },
  {
    id: "art_02",
    type: "cloze",
    question:
      "The committee reached _____ agreement on the new budget proposal after hours of discussion.",
    options: ["a", "an", "the", "(no article)"],
    correctAnswer: "A",
    grammarPattern: "不定冠詞用法（Indefinite Article）",
    explanation:
      "「reach an agreement」是固定搭配，agreement 在此為可數名詞，初次提及且非特定，用不定冠詞 an（agreement 以元音音素開頭）。",
  },

  // ── Prepositions ──────────────────────────────────────────────────────────
  {
    id: "prep_01",
    type: "cloze",
    question:
      "The team has been working _____ this project for the past six months.",
    options: ["at", "on", "in", "about"],
    correctAnswer: "B",
    grammarPattern: "介系詞搭配（work on）",
    explanation:
      "「work on」表示從事/致力於某項工作或專案，是固定介系詞搭配。work at 通常指在某地點工作，work in 指在某領域/行業工作。",
  },
  {
    id: "prep_02",
    type: "cloze",
    question:
      "The merger resulted _____ significant cost savings for both companies.",
    options: ["from", "in", "to", "with"],
    correctAnswer: "B",
    grammarPattern: "介系詞搭配（result in vs result from）",
    explanation:
      "「result in」表示「導致/造成」（後接結果）；「result from」表示「源自/起因於」（後接原因）。此句合併導致了節省，故用 result in。",
  },

  // ── Parallel Structure ─────────────────────────────────────────────────────
  {
    id: "para_01",
    type: "multiple_choice",
    question:
      "The new policy requires all staff to submit reports weekly, attend mandatory training, and _____.",
    options: [
      "A. completing annual reviews",
      "B. to complete annual reviews",
      "C. complete annual reviews",
      "D. completed annual reviews",
    ],
    correctAnswer: "C",
    grammarPattern: "平行結構（Parallel Structure）",
    explanation:
      "and 連接的項目必須使用相同的文法形式（平行結構）。前面是 to submit、attend（不定詞省略 to），故第三項也應用原形動詞 complete。",
  },
];
