import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ColorResolvable,
} from "discord.js";
import { ToeicQuestion, toeicQuestions } from "./toeicQuestions";

type AnswerChoice = "A" | "B" | "C" | "D";

interface QuizSession {
  questions: ToeicQuestion[];
  currentIndex: number;
  score: number;
  wrongAnswers: { question: ToeicQuestion; userAnswer: AnswerChoice }[];
  startTime: number;
}

// Keyed by userId
const quizSessions = new Map<string, QuizSession>();

const OPTION_LABELS: AnswerChoice[] = ["A", "B", "C", "D"];

const BUTTON_CUSTOM_IDS: Record<AnswerChoice, string> = {
  A: "toeic_answer_A",
  B: "toeic_answer_B",
  C: "toeic_answer_C",
  D: "toeic_answer_D",
};

export function getAnswerFromCustomId(customId: string): AnswerChoice | null {
  const map: Record<string, AnswerChoice> = {
    toeic_answer_A: "A",
    toeic_answer_B: "B",
    toeic_answer_C: "C",
    toeic_answer_D: "D",
  };
  return map[customId] ?? null;
}

export function isToeicButtonId(customId: string): boolean {
  return customId in BUTTON_CUSTOM_IDS;
}

function getRandomQuestions(count: number): ToeicQuestion[] {
  const shuffled = [...toeicQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, toeicQuestions.length));
}

function buildAnswerButtons(disabled = false): ActionRowBuilder<ButtonBuilder> {
  const buttons = OPTION_LABELS.map((label) =>
    new ButtonBuilder()
      .setCustomId(BUTTON_CUSTOM_IDS[label])
      .setLabel(label)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled)
  );
  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
}

function buildQuestionEmbed(
  question: ToeicQuestion,
  index: number,
  total: number
): EmbedBuilder {
  const optionLines = OPTION_LABELS.map(
    (label, i) => `**${label}.** ${question.options[i]}`
  ).join("\n");

  return new EmbedBuilder()
    .setTitle(`📝 多益文法練習 — 第 ${index + 1} / ${total} 題`)
    .setDescription(`**${question.question}**\n\n${optionLines}`)
    .setColor(0x5865f2)
    .setFooter({ text: "請點選下方按鈕作答" });
}

function buildAnsweredEmbed(
  question: ToeicQuestion,
  index: number,
  total: number,
  userAnswer: AnswerChoice,
  isCorrect: boolean
): EmbedBuilder {
  const correctOption =
    OPTION_LABELS.indexOf(question.correctAnswer) !== -1
      ? question.options[OPTION_LABELS.indexOf(question.correctAnswer)]
      : "";

  const optionLines = OPTION_LABELS.map((label, i) => {
    const text = question.options[i];
    if (label === question.correctAnswer) return `✅ **${label}.** ${text}`;
    if (label === userAnswer && !isCorrect) return `❌ **${label}.** ${text}`;
    return `　 ${label}. ${text}`;
  }).join("\n");

  const color: ColorResolvable = isCorrect ? 0x57f287 : 0xed4245;
  const result = isCorrect ? "✅ 答對了！" : `❌ 答錯了！正確答案是 **${question.correctAnswer}**`;

  return new EmbedBuilder()
    .setTitle(`📝 多益文法練習 — 第 ${index + 1} / ${total} 題`)
    .setDescription(`**${question.question}**\n\n${optionLines}`)
    .addFields({ name: result, value: `正確答案：**${question.correctAnswer}.** ${correctOption}` })
    .setColor(color)
    .setFooter({ text: "稍後顯示下一題..." });
}

function buildResultEmbed(session: QuizSession): EmbedBuilder {
  const { questions, score, wrongAnswers } = session;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  let color: ColorResolvable;
  if (percentage >= 80) color = 0x57f287;
  else if (percentage >= 50) color = 0xfee75c;
  else color = 0xed4245;

  const embed = new EmbedBuilder()
    .setTitle("🎯 測驗結果")
    .setDescription(
      `你答對了 **${score} / ${total}** 題（${percentage}%）`
    )
    .setColor(color);

  if (wrongAnswers.length === 0) {
    embed.addFields({ name: "🏆 完美！", value: "所有題目全部答對，文法實力很強！" });
    return embed;
  }

  embed.addFields({ name: "📚 錯誤題目詳解", value: "以下是你答錯的題目：" });

  for (const { question, userAnswer } of wrongAnswers) {
    const correctOptionText =
      question.options[OPTION_LABELS.indexOf(question.correctAnswer)];
    const userOptionText =
      question.options[OPTION_LABELS.indexOf(userAnswer)];

    const value =
      `**題目：** ${question.question}\n` +
      `**你的答案：** ${userAnswer}. ${userOptionText}\n` +
      `**正確答案：** ${question.correctAnswer}. ${correctOptionText}\n\n` +
      `**句型：** ${question.grammarPattern}\n` +
      `**詳解：** ${question.explanation}`;

    embed.addFields({ name: "─────────────────", value });
  }

  return embed;
}

export async function handleQuizStart(
  interaction: ChatInputCommandInteraction,
  count: number
): Promise<void> {
  const userId = interaction.user.id;

  if (quizSessions.has(userId)) {
    await interaction.reply({
      content: "⚠️ 你已有進行中的測驗！請先完成目前的測驗再開始新的一輪。",
      ephemeral: true,
    });
    return;
  }

  const questions = getRandomQuestions(count);
  const session: QuizSession = {
    questions,
    currentIndex: 0,
    score: 0,
    wrongAnswers: [],
    startTime: Date.now(),
  };
  quizSessions.set(userId, session);

  const embed = buildQuestionEmbed(questions[0], 0, questions.length);
  const row = buildAnswerButtons();

  await interaction.reply({ embeds: [embed], components: [row] });
}

export async function handleQuizAnswer(
  interaction: ButtonInteraction,
  userAnswer: AnswerChoice
): Promise<void> {
  const userId = interaction.user.id;
  const session = quizSessions.get(userId);

  if (!session) {
    await interaction.reply({
      content: "⚠️ 你目前沒有進行中的測驗。請使用 `/toeic` 開始新測驗。",
      ephemeral: true,
    });
    return;
  }

  const { questions, currentIndex } = session;
  const question = questions[currentIndex];
  const isCorrect = userAnswer === question.correctAnswer;

  if (isCorrect) {
    session.score++;
  } else {
    session.wrongAnswers.push({ question, userAnswer });
  }

  // Show answered state (buttons disabled)
  const answeredEmbed = buildAnsweredEmbed(
    question,
    currentIndex,
    questions.length,
    userAnswer,
    isCorrect
  );
  await interaction.update({
    embeds: [answeredEmbed],
    components: [buildAnswerButtons(true)],
  });

  session.currentIndex++;

  // Small delay so user can read the result before next question
  await new Promise((r) => setTimeout(r, 1500));

  if (session.currentIndex < questions.length) {
    const nextEmbed = buildQuestionEmbed(
      questions[session.currentIndex],
      session.currentIndex,
      questions.length
    );
    await interaction.editReply({
      embeds: [nextEmbed],
      components: [buildAnswerButtons()],
    });
  } else {
    // Quiz complete
    quizSessions.delete(userId);
    const resultEmbed = buildResultEmbed(session);
    await interaction.editReply({ embeds: [resultEmbed], components: [] });
  }
}
