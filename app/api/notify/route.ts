import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { notifyTrainerIfFormationComplete } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await notifyTrainerIfFormationComplete(session.userId);

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.userId, isComplete: true },
  });
  const scores = progress
    .map((row) => row.quizScore)
    .filter((score): score is number => typeof score === "number");
  const average =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null;

  return NextResponse.json({
    sent: true,
    username: session.username,
    average,
  });
}
