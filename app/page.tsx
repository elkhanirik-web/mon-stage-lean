import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { resolveThumbnail } from "@/lib/thumbnails";

export default async function LandingPage() {
  const session = await getSession();
  const modules = await prisma.module.findMany({ orderBy: { order: "asc" } });

  // Fallback modules if DB is not seeded yet
  const fallbackModules = [
    {
      id: 1,
      title: "Introduction au Lean Management",
      description: "Comprendre les origines du Lean, la chasse aux gaspillages (Muda) et la création de valeur.",
      thumbnail: "/thumbnails/lean-intro.png",
    },
    {
      id: 2,
      title: "La méthode des 5S",
      description: "Organiser le poste de travail pour plus de sécurité, d'efficacité et de clarté au quotidien.",
      thumbnail: "/thumbnails/lean-5s.png",
    },
    {
      id: 3,
      title: "Le Kaizen",
      description: "Animer des petits pas d'amélioration continue au quotidien en impliquant vos équipes.",
      thumbnail: "/thumbnails/lean-kaizen.png",
    },
    {
      id: 4,
      title: "VSM - Cartographie des flux",
      description: "Visualiser la chaîne de valeur pour identifier les goulots d'étranglement et éliminer les gaspillages.",
      thumbnail: "/thumbnails/lean-vsm.png",
    },
    {
      id: 5,
      title: "Indicateurs de performance (KPI)",
      description: "Piloter la performance SQCD (Sécurité, Qualité, Coûts, Délais) et suivre le TRS.",
      thumbnail: "/thumbnails/lean-kpi.png",
    },
  ];

  const displayModules = modules.length > 0 ? modules : fallbackModules;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white shadow-md">
              L
            </span>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Formation <span className="text-emerald-700">Lean Management</span>
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Mon Tableau de Bord
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/10">
                Formation 100% en ligne • Accès Libre
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Maîtrisez le <span className="text-emerald-700">Lean Management</span> au quotidien
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Une formation structurée en 5 modules interactifs. Éliminez les gaspillages, optimisez vos processus, et développez une culture d&apos;amélioration continue au sein de vos équipes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-emerald-800"
                  >
                    Accéder à mon espace apprenant
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-emerald-800"
                    >
                      Commencer la formation
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Me connecter
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-emerald-600 to-slate-900 p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
                <div className="space-y-2">
                  <p className="text-emerald-300 font-mono text-sm">PROTOTYPE LMS</p>
                  <p className="text-2xl font-bold">Mon Stage Lean</p>
                  <p className="text-slate-300 text-sm">Formation certifiante accélérée</p>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold">
                      ✓
                    </span>
                    <span className="text-sm">Vidéos immersives de 10 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold">
                      ✓
                    </span>
                    <span className="text-sm">Validation par quiz de connaissances (≥70%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold">
                      ✓
                    </span>
                    <span className="text-sm">Notification de réussite automatique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi le Lean? Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pourquoi se former au Lean Management ?
            </h2>
            <p className="text-lg text-slate-600">
              Le Lean n&apos;est pas seulement une boîte à outils, c&apos;est un état d&apos;esprit d&apos;excellence opérationnelle.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-700">
                🗑️
              </span>
              <h3 className="text-lg font-bold text-slate-900">Éliminer les gaspillages</h3>
              <p className="text-sm text-slate-600">
                Identifiez et supprimez les 7 types de gaspillages (Muda) pour libérer du temps et des ressources sur les tâches à forte valeur ajoutée.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-700">
                📈
              </span>
              <h3 className="text-lg font-bold text-slate-900">Amélioration Continue (Kaizen)</h3>
              <p className="text-sm text-slate-600">
                Instaurez une culture de progrès par petits pas au quotidien, impliquant chaque collaborateur pour résoudre les problèmes à la source.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-700">
                🎯
              </span>
              <h3 className="text-lg font-bold text-slate-900">Satisfaction Client</h3>
              <p className="text-sm text-slate-600">
                Recentrez votre organisation sur la création de valeur pure pour le client final, en améliorant la qualité et en réduisant les délais de livraison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Le Programme de Formation
            </h2>
            <p className="text-lg text-slate-600">
              Un parcours pédagogique structuré en 5 modules chronologiques. Chaque étape doit être validée pour débloquer la suivante.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayModules.map((module, index) => (
              <div
                key={module.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
                  <img
                    src={resolveThumbnail(
                     "order" in module && typeof module.order === "number" ? module.order : index + 1 ,
                      module.thumbnail,
                    )}
                    alt={module.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-800/20" />
                  <div className="absolute top-4 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">
                    {module.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Comment se déroule la formation ?
            </h2>
            <p className="text-lg text-slate-300">
              Une méthodologie de validation rigoureuse pour garantir l&apos;acquisition de vos compétences.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400 border border-emerald-500/30">
                1
              </span>
              <h3 className="text-lg font-semibold">Créez votre compte</h3>
              <p className="text-sm text-slate-400">
                Inscrivez-vous gratuitement en quelques clics pour démarrer immédiatement votre parcours de formation.
              </p>
            </div>
            <div className="space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400 border border-emerald-500/30">
                2
              </span>
              <h3 className="text-lg font-semibold">Visionnez les cours</h3>
              <p className="text-sm text-slate-400">
                Suivez la vidéo de formation de 10 minutes par module. Le lecteur intelligent mémorise votre avancement exact.
              </p>
            </div>
            <div className="space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400 border border-emerald-500/30">
                3
              </span>
              <h3 className="text-lg font-semibold">Réussissez le Quiz</h3>
              <p className="text-sm text-slate-400">
                Répondez aux questions à choix multiples. Vous devez valider au moins 70% pour débloquer le cours suivant.
              </p>
            </div>
            <div className="space-y-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400 border border-emerald-500/30">
                4
              </span>
              <h3 className="text-lg font-semibold">Notification finale</h3>
              <p className="text-sm text-slate-400">
                Une fois le module 5 validé, un e-mail récapitulatif avec vos scores est automatiquement envoyé au formateur.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white shadow-md transition hover:bg-emerald-500"
              >
                Retourner à mon tableau de bord
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white shadow-md transition hover:bg-emerald-500"
              >
                Créer mon compte & Commencer
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-700 text-sm font-bold text-white">
              L
            </span>
            <span className="font-semibold text-slate-900">Mon Stage Lean</span>
          </div>
          <p className="text-sm text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} Mon Stage Lean • Plateforme Prototype d&apos;Excellence Opérationnelle.
          </p>
        </div>
      </footer>
    </div>
  );
}
