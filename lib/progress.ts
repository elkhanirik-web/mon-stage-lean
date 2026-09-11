import { prisma } from "@/lib/prisma";
import { parseQuizData } from "@/lib/quiz";
import { notifyTrainerIfFormationComplete } from "@/lib/email";

export async function getModuleAccess(userId: number, moduleId: number) {
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
  });
  const progressRows = await prisma.userProgress.findMany({
    where: { userId },
  });
  const progressByModuleId = new Map(
    progressRows.map((row) => [row.moduleId, row]),
  );

  const target = modules.find((module) => module.id === moduleId);
  if (!target) {
    return { allowed: false as const, reason: "not_found" as const };
  }

  const previous = modules.find((module) => module.order === target.order - 1);
  const previousComplete = previous
    ? progressByModuleId.get(previous.id)?.isComplete === true
    : true;

  if (!previousComplete) {
    return { allowed: false as const, reason: "locked" as const, module: target };
  }

  return {
    allowed: true as const,
    module: target,
    progress: progressByModuleId.get(target.id) ?? null,
    quiz: parseQuizData(target.quizData),
  };
}

export async function upsertProgress(
  userId: number,
  moduleId: number,
  data: {
    timerSeconds?: number;
    videoViewed?: boolean;
    quizScore?: number;
    quizPassed?: boolean;
    isComplete?: boolean;
  },
) {
  return prisma.userProgress.upsert({
    where: {
      userId_moduleId: { userId, moduleId },
    },
    create: {
      userId,
      moduleId,
      timerSeconds: data.timerSeconds ?? 0,
      videoViewed: data.videoViewed ?? false,
      quizScore: data.quizScore,
      quizPassed: data.quizPassed ?? false,
      isComplete: data.isComplete ?? false,
    },
    update: data,
  });
}

export async function maybeCompleteAndNotify(userId: number, moduleId: number) {
  const progress = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });

  if (!progress) {
    return null;
  }

  const isComplete = progress.videoViewed && progress.quizPassed;
  const justCompleted = isComplete && !progress.isComplete;

  if (progress.isComplete !== isComplete) {
    await prisma.userProgress.update({
      where: { id: progress.id },
      data: { isComplete },
    });
  }

  if (justCompleted) {
    await notifyTrainerIfFormationComplete(userId);
  }

  return { ...progress, isComplete };
}
