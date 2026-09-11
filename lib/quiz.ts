export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type QuizData = {
  questions: QuizQuestion[];
};

export const VIDEO_MAX_SECONDS = 600;
export const QUIZ_PASS_THRESHOLD = 70;
export const PROGRESS_SAVE_INTERVAL_MS = 3000;

export function parseQuizData(raw: unknown): QuizData {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return { questions: [] };
    }
  }
  if (
    typeof data === "object" &&
    data !== null &&
    "questions" in data &&
    Array.isArray((data as QuizData).questions)
  ) {
    return data as QuizData;
  }
  return { questions: [] };
}

export function publicQuestions(quiz: QuizData) {
  return quiz.questions.map((item) => ({
    question: item.question,
    options: item.options,
  }));
}

export function gradeQuiz(quiz: QuizData, answers: number[]) {
  const total = quiz.questions.length;
  if (total === 0) {
    return { score: 0, quizPassed: false, correct: 0, total: 0 };
  }

  let correct = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) {
      correct += 1;
    }
  });

  const score = Math.round((correct / total) * 100);
  return {
    score,
    quizPassed: score >= QUIZ_PASS_THRESHOLD,
    correct,
    total,
  };
}
