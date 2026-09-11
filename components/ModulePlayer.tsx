"use client";

import { useState } from "react";
import Link from "next/link";
import VideoSimulator from "@/components/VideoSimulator";
import Quiz from "@/components/Quiz";

type Question = {
  question: string;
  options: string[];
};

type ModulePlayerProps = {
  moduleId: number;
  title: string;
  description: string;
  thumbnail: string;
  initialSeconds: number;
  videoViewed: boolean;
  questions: Question[];
};

export default function ModulePlayer({
  moduleId,
  title,
  description,
  thumbnail,
  initialSeconds,
  videoViewed,
  questions,
}: ModulePlayerProps) {
  const [viewed, setViewed] = useState(videoViewed);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="text-sm text-emerald-800 hover:underline">
          ← Retour au dashboard
        </Link>
      </div>
      <header>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </header>

      <VideoSimulator
        moduleId={moduleId}
        thumbnail={thumbnail}
        title={title}
        initialSeconds={initialSeconds}
        alreadyViewed={videoViewed}
        onCompleted={() => setViewed(true)}
      />

      {viewed && !showQuiz && (
        <button
          type="button"
          onClick={() => setShowQuiz(true)}
          className="rounded-xl bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800"
        >
          Passer au Quiz
        </button>
      )}

      {showQuiz && <Quiz moduleId={moduleId} questions={questions} />}
    </div>
  );
}
