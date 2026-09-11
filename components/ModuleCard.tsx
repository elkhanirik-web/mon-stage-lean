"use client";

import Link from "next/link";

type ModuleCardProps = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: "locked" | "available" | "complete";
};

const statusLabel = {
  locked: "🔒 Verrouillé",
  available: "🔓 Disponible",
  complete: "✅ Terminé",
};

export default function ModuleCard({
  id,
  title,
  description,
  thumbnail,
  status,
}: ModuleCardProps) {
  const content = (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
        status === "locked" ? "border-slate-200 opacity-70" : "border-emerald-200"
      }`}
    >
      <div className="relative aspect-video bg-slate-200">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/70 to-transparent p-4">
          <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-medium text-slate-800">
            {statusLabel[status]}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
        {status === "locked" ? (
          <span className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500">
            Accéder
          </span>
        ) : (
          <span className="inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white">
            Accéder
          </span>
        )}
      </div>
    </article>
  );

  if (status === "locked") {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={`/module/${id}`} className="block transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}
