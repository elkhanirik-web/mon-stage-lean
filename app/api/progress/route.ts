import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getModuleAccess, upsertProgress } from "@/lib/progress";
import { VIDEO_MAX_SECONDS } from "@/lib/quiz";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const moduleId = Number(new URL(request.url).searchParams.get("moduleId"));
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId invalide" }, { status: 400 });
  }

  const access = await getModuleAccess(session.userId, moduleId);
  if (!access.allowed) {
    return NextResponse.json({ error: "Module verrouillé" }, { status: 403 });
  }

  return NextResponse.json({
    timerSeconds: access.progress?.timerSeconds ?? 0,
    videoViewed: access.progress?.videoViewed ?? false,
    quizScore: access.progress?.quizScore ?? null,
    quizPassed: access.progress?.quizPassed ?? false,
    isComplete: access.progress?.isComplete ?? false,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await request.json()) as {
    moduleId?: number;
    timerSeconds?: number;
  };

  const moduleId = Number(body.moduleId);
  const timerSeconds = Math.min(
    VIDEO_MAX_SECONDS,
    Math.max(0, Math.floor(Number(body.timerSeconds ?? 0))),
  );

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId invalide" }, { status: 400 });
  }

  const access = await getModuleAccess(session.userId, moduleId);
  if (!access.allowed) {
    return NextResponse.json({ error: "Module verrouillé" }, { status: 403 });
  }

  const videoViewed = timerSeconds >= VIDEO_MAX_SECONDS;
  const progress = await upsertProgress(session.userId, moduleId, {
    timerSeconds,
    videoViewed: videoViewed || access.progress?.videoViewed,
  });

  return NextResponse.json({
    timerSeconds: progress.timerSeconds,
    videoViewed: progress.videoViewed,
  });
}
