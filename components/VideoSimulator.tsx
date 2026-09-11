"use client";

import { useEffect, useRef, useState } from "react";
import { PROGRESS_SAVE_INTERVAL_MS, VIDEO_MAX_SECONDS } from "@/lib/quiz";

type VideoSimulatorProps = {
  moduleId: number;
  thumbnail: string;
  title: string;
  initialSeconds: number;
  alreadyViewed: boolean;
  onCompleted: () => void;
};

function formatTime(total: number) {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VideoSimulator({
  moduleId,
  thumbnail,
  title,
  initialSeconds,
  alreadyViewed,
  onCompleted,
}: VideoSimulatorProps) {
  const [seconds, setSeconds] = useState(
    Math.min(initialSeconds, VIDEO_MAX_SECONDS),
  );
  const [playing, setPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const secondsRef = useRef(seconds);
  const completedRef = useRef(alreadyViewed || initialSeconds >= VIDEO_MAX_SECONDS);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  async function saveProgress(value: number) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, timerSeconds: value }),
    });
  }

  useEffect(() => {
    if (!playing || seconds >= VIDEO_MAX_SECONDS) {
      return;
    }

    const tick = window.setInterval(() => {
      setSeconds((current) => {
        const next = Math.min(current + 1, VIDEO_MAX_SECONDS);
        if (next >= VIDEO_MAX_SECONDS && !completedRef.current) {
          completedRef.current = true;
          void saveProgress(VIDEO_MAX_SECONDS);
          onCompleted();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [playing, seconds, onCompleted]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const save = window.setInterval(() => {
      void saveProgress(secondsRef.current);
    }, PROGRESS_SAVE_INTERVAL_MS);

    return () => window.clearInterval(save);
  }, [playing, moduleId]);

  useEffect(() => {
    function persist() {
      void saveProgress(secondsRef.current);
    }

    window.addEventListener("beforeunload", persist);
    return () => {
      persist();
      window.removeEventListener("beforeunload", persist);
    };
  }, [moduleId]);

  const remaining = VIDEO_MAX_SECONDS - seconds;
  const done = seconds >= VIDEO_MAX_SECONDS;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl">
      <div className="relative aspect-video w-full bg-slate-800">
        {!imageError ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover opacity-80"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-800 to-slate-900 text-center text-emerald-100">
            <p className="px-6 text-lg font-medium">
              Image à venir
              <br />
              <span className="text-sm opacity-80">{thumbnail}</span>
            </p>
          </div>
        )}

        {!playing && !done && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/35"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-900 shadow-lg">
              PLAY
            </span>
          </button>
        )}
      </div>

      <div className="space-y-3 bg-slate-900 px-5 py-4 text-slate-100">
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-700"
          role="progressbar"
          aria-valuenow={seconds}
          aria-valuemin={0}
          aria-valuemax={VIDEO_MAX_SECONDS}
        >
          <div
            className="h-full rounded-full bg-emerald-400 transition-[width]"
            style={{ width: `${(seconds / VIDEO_MAX_SECONDS) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-300">
              Chronomètre (max 10 min)
            </p>
            <p className="font-mono text-3xl">{formatTime(seconds)}</p>
          </div>
          <div className="text-right text-sm text-slate-300">
            <p>Restant : {formatTime(remaining)}</p>
            {playing && !done && (
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="mt-2 rounded-lg border border-slate-500 px-3 py-1 hover:bg-slate-800"
              >
                Pause
              </button>
            )}
            {done && <p className="mt-1 font-semibold text-emerald-400">Visionnage terminé</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
