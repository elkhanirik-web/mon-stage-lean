import ModuleCard from "@/components/ModuleCard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { resolveThumbnail } from "@/lib/thumbnails";
import { redirect } from "next/navigation";

type DashboardPageProps = {
  searchParams: Promise<{ quiz?: string; score?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { quiz, score } = await searchParams;
  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });
  const progressRows = await prisma.userProgress.findMany({
    where: { userId: session.userId },
  });
  const progressByModuleId = new Map(progressRows.map((row) => [row.moduleId, row]));
  const completedCount = modules.filter(
    (module) => progressByModuleId.get(module.id)?.isComplete === true,
  ).length;
  const allComplete = modules.length > 0 && completedCount === modules.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bonjour {session.username}
        </h1>
        <p className="mt-1 text-slate-600">
          Parcourez les 5 modules dans l&apos;ordre. Le module suivant se débloque
          lorsque le précédent est terminé (vidéo + quiz réussi).
        </p>
      </div>

      {quiz === "passed" && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          Quiz réussi{score ? ` — score ${score}%` : ""}. Module validé.
        </p>
      )}
      {quiz === "failed" && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Quiz non validé{score ? ` — score ${score}%` : ""} (minimum 70 %). Vous
          pouvez retenter le module.
        </p>
      )}

      {allComplete && (
        <p className="rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-4 text-emerald-950">
          Félicitations {session.username} : vous avez terminé les 5 modules de
          formation Lean Management. Un e-mail de réussite a été envoyé au
          formateur.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => {
          const progress = progressByModuleId.get(module.id);
          const previous = index === 0 ? null : modules[index - 1];
          const previousComplete = previous
            ? progressByModuleId.get(previous.id)?.isComplete === true
            : true;
          const status = progress?.isComplete
            ? "complete"
            : previousComplete
              ? "available"
              : "locked";

          return (
            <ModuleCard
              key={module.id}
              id={module.id}
              title={module.title}
              description={module.description}
              thumbnail={resolveThumbnail(module.order, module.thumbnail)}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}
