"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
};

type QuizProps = {
  moduleId: number;
  questions: Question[];
};

export default function Quiz({ moduleId, questions }: QuizProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    quizPassed: boolean;
  } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (answers.some((answer) => answer === null)) {
      setError("Merci de répondre à toutes les questions.");
      return;
    }

    setPending(true);
    setError(null);

    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, answers }),
    });
    const data = (await response.json()) as {
      error?: string;
      score?: number;
      quizPassed?: boolean;
    };

    if (!response.ok) {
      setPending(false);
      setError(data.error ?? "Impossible de valider le quiz.");
      return;
    }

    setPending(false);
    setResult({
      score: data.score ?? 0,
      quizPassed: Boolean(data.quizPassed),
    });

    window.setTimeout(() => {
      router.push(
        `/dashboard?quiz=${data.quizPassed ? "passed" : "failed"}&score=${data.score}`,
      );
      router.refresh();
    }, 1800);
  }

  if (result) {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Résultat du quiz</h2>
        <p className="text-3xl font-bold text-slate-900">{result.score}%</p>
        <p className={result.quizPassed ? "text-emerald-700" : "text-amber-800"}>
          {result.quizPassed
            ? "Quiz réussi — module validé. Redirection vers le dashboard…"
            : "Score insuffisant (minimum 70 %). Redirection vers le dashboard…"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Quiz du module</h2>
      <p className="text-sm text-slate-600">
        4 questions QCM. Il faut au moins 70 % de bonnes réponses (3/4) pour valider.
      </p>

      {questions.map((question, questionIndex) => (
        <fieldset key={question.question} className="space-y-3">
          <legend className="font-medium text-slate-800">
            {questionIndex + 1}. {question.question}
          </legend>
          {question.options.map((option, optionIndex) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              <input
                type="radio"
                name={`q-${questionIndex}`}
                checked={answers[questionIndex] === optionIndex}
                onChange={() =>
                  setAnswers((current) =>
                    current.map((value, index) =>
                      index === questionIndex ? optionIndex : value,
                    ),
                  )
                }
                className="mt-1"
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {pending ? "Validation..." : "Soumettre le quiz"}
      </button>
    </form>
  );
}
