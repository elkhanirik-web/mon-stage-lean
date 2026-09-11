import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getModuleAccess, maybeCompleteAndNotify, upsertProgress } from "@/lib/progress";
import { gradeQuiz } from "@/lib/quiz";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await request.json()) as {
    moduleId?: number;
    answers?: number[];
  };

  const moduleId = Number(body.moduleId);
  const answers = Array.isArray(body.answers) ? body.answers.map(Number) : [];

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId invalide" }, { status: 400 });
  }

  const access = await getModuleAccess(session.userId, moduleId);
  if (!access.allowed) {
    return NextResponse.json({ error: "Module verrouillé" }, { status: 403 });
  }

  if (!access.progress?.videoViewed) {
    return NextResponse.json(
      { error: "La vidéo simulée doit être terminée avant le quiz." },
      { status: 400 },
    );
  }

  const result = gradeQuiz(access.quiz, answers);
  await upsertProgress(session.userId, moduleId, {
    quizScore: result.score,
    quizPassed: result.quizPassed,
  });
  const completed = await maybeCompleteAndNotify(session.userId, moduleId);

  return NextResponse.json({
    score: result.score,
    quizPassed: result.quizPassed,
    isComplete: completed?.isComplete ?? false,
    correct: result.correct,
    total: result.total,
  });
}
