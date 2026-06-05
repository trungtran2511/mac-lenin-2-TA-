/** Cắt gọn câu hỏi/đáp án quiz để dễ đọc trên màn hình. */
export function truncateQuizText(text, maxLen = 120) {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLen) return trimmed;

  const cut = trimmed.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const base =
    lastSpace > maxLen * 0.55 ? cut.slice(0, lastSpace) : cut.trimEnd();

  return `${base.replace(/[,;:\s]+$/, "")}…`;
}

export function normalizeQuizQuestion(question) {
  return {
    ...question,
    question: question.question.trim().replace(/\s+/g, " "),
    options: question.options.map((option) => option.trim().replace(/\s+/g, " ")),
  };
}

export function formatTextbookSource(source) {
  if (!source || typeof source !== "string") return source;

  const normalized = source.trim().replace(/\s+/g, " ");
  const wordMatch = normalized.match(/;?\s*đoạn Word\s+\d+/i);
  const wordRef = wordMatch ? wordMatch[0].replace(/^;\s*/, "") : "";
  const sourcePath = wordMatch
    ? normalized.slice(0, wordMatch.index).replace(/[;\s]+$/, "")
    : normalized;

  const titleParts = sourcePath
    .split(">")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part, index) => index === 0 || part.length <= 150);

  const compactPath =
    titleParts.length > 0
      ? titleParts.join(" > ")
      : truncateQuizText(sourcePath, 150);

  return wordRef ? `${compactPath}; ${wordRef}` : compactPath;
}
