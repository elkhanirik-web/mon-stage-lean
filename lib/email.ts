import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function notifyTrainerIfFormationComplete(userId: number) {
  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });
  const lastModule = modules.find((module) => module.order === 5);
  if (!lastModule) {
    return;
  }

  const lastProgress = await prisma.userProgress.findUnique({
    where: { userId_moduleId: { userId, moduleId: lastModule.id } },
  });

  if (!lastProgress?.isComplete) {
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return;
  }

  const allProgress = await prisma.userProgress.findMany({
    where: { userId, isComplete: true },
  });
  const scores = allProgress
    .map((row) => row.quizScore)
    .filter((score): score is number => typeof score === "number");
  const average =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null;

  const subject = `Formation Lean terminée — ${user.username}`;
  const text = [
    "Un participant a terminé les 5 modules de formation Lean Management.",
    "",
    `Nom du participant : ${user.username}`,
    `Score total (moyenne des quiz) : ${average !== null ? `${average}%` : "Réussi"}`,
    "Statut : Réussi",
  ].join("\n");

  const userName = process.env.MAILTRAP_USER;
  const password = process.env.MAILTRAP_PASS;

  if (!userName || !password) {
    console.log("[EMAIL DEMO — Mailtrap non configuré]");
    console.log(subject);
    console.log(text);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST ?? "sandbox.smtp.mailtrap.io",
    port: Number(process.env.MAILTRAP_PORT ?? 2525),
    auth: { user: userName, pass: password },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL ?? "formation@mon-stage-lean.local",
    to: process.env.TRAINER_EMAIL ?? "formateur@example.com",
    subject,
    text,
  });
}
