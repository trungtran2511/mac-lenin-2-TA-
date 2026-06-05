import { normalizeQuizQuestion } from "./quizText";
import { textbookExplanations } from "../data/textbookExplanations";

export const LIVE_QUIZ_HOST_KEY = "live_quiz_host_tokens";
export const LIVE_QUIZ_PLAYER_KEY = "live_quiz_player_tokens";
export const LIVE_QUIZ_MAX_PLAYERS = 40;

export const liveQuizTimeLimits = {
  10: 5 * 60,
  20: 10 * 60,
  30: 15 * 60,
  50: 30 * 60,
  100: 60 * 60,
  200: 120 * 60,
  504: 300 * 60,
};

export const buffCatalog = [
  {
    id: "fifty_fifty",
    name: "Gợi ý 50/50",
    icon: "bi-magic",
    description: "Ẩn 2 đáp án sai trong câu hiện tại.",
  },
  {
    id: "double_score",
    name: "Nhân đôi điểm",
    icon: "bi-stars",
    description: "Trả lời đúng câu này sẽ được x2 điểm!",
  },
  {
    id: "time_plus",
    name: "Cộng giờ",
    icon: "bi-clock-history",
    description: "Cộng thêm 15 giây cho câu hiện tại.",
  },
  {
    id: "retry_wrong",
    name: "Gỡ sai",
    icon: "bi-arrow-counterclockwise",
    description: "Cho phép chọn lại nếu trả lời sai câu này.",
  },
  {
    id: "skip_pressure",
    name: "Bình tĩnh",
    icon: "bi-hourglass-split",
    description: "Cộng thêm 20 giây cho câu hiện tại.",
  },
  {
    id: "focus_jump",
    name: "Đổi gió",
    icon: "bi-shuffle",
    description: "Nhảy tới một câu chưa trả lời bất kỳ.",
  },
];

export function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export function generateToken(prefix = "tok") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function fisherYatesShuffle(items, seedValue = Math.random()) {
  const array = [...items];
  let seed =
    typeof seedValue === "number"
      ? seedValue
      : Array.from(String(seedValue)).reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0,
      );

  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array;
}

export function pickRoomQuestions(allQuestions, config) {
  let filtered = [...allQuestions];

  if (config.chapter !== "random") {
    filtered = filtered.filter((question) => question.chapter === Number(config.chapter));
  }

  if (config.difficulty !== "random") {
    filtered = filtered.filter(
      (question) => question.difficulty === Number(config.difficulty),
    );
  }

  return fisherYatesShuffle(filtered)
    .slice(0, Number(config.numberOfQuestions))
    .map(normalizeQuizQuestion)
    .map((question) => {
      const expData = textbookExplanations[question.id];
      return {
        id: question.id,
        chapter: question.chapter,
        difficulty: question.difficulty,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: expData ? expData.explanation : (question.explanation || ""),
      };
    });
}

export function createQuestionOrder(questionCount, seed) {
  return fisherYatesShuffle(
    Array.from({ length: questionCount }, (_, index) => index),
    seed,
  );
}

export function getStoredToken(storageKey, roomCode) {
  try {
    const records = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return records[roomCode] || null;
  } catch {
    return null;
  }
}

export function storeToken(storageKey, roomCode, token) {
  const records = JSON.parse(localStorage.getItem(storageKey) || "{}");
  records[roomCode] = token;
  localStorage.setItem(storageKey, JSON.stringify(records));
}

export function maybeCreateBuff(
  enabled,
  currentBuff,
  questionIndex,
  buffCount = 0,
  lastBuffQuestionIndex = null,
) {
  if (!enabled || (currentBuff && !currentBuff.used)) return null;
  if (
    currentBuff?.id === "retry_previous_wrong" &&
    !currentBuff?.completedRetry
  ) {
    return null;
  }
  if (
    Number.isInteger(lastBuffQuestionIndex) &&
    questionIndex === lastBuffQuestionIndex + 1
  ) {
    return null;
  }

  // Lần 1: 100% (đảm bảo ít nhất 1 buff), lần 2: 40%, lần 3: 10%, lần 4+: 0%
  const rates = [1.0, 0.40, 0.10];
  const rate = buffCount < rates.length ? rates[buffCount] : 0;
  if (Math.random() >= rate) return null;

  const availableBuffs = buffCatalog.filter((buff) => buff.id !== "focus_jump");
  const buff = availableBuffs[Math.floor(Math.random() * availableBuffs.length)];
  return {
    ...buff,
    questionIndex,
    receivedAt: new Date().toISOString(),
    used: false,
  };
}

export function calculateLeaderboard(players = []) {
  return [...players].sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    if ((b.correct_count || 0) !== (a.correct_count || 0)) {
      return (b.correct_count || 0) - (a.correct_count || 0);
    }
    return new Date(a.submitted_at || 0) - new Date(b.submitted_at || 0);
  });
}
