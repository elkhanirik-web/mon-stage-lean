import { redirect } from "next/navigation";
import ModulePlayer from "@/components/ModulePlayer";
import { getSession } from "@/lib/session";
import { getModuleAccess } from "@/lib/progress";
import { publicQuestions } from "@/lib/quiz";
import { resolveThumbnail } from "@/lib/thumbnails";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const moduleId = Number(id);
  if (!moduleId) {
    redirect("/dashboard");
  }

  const access = await getModuleAccess(session.userId, moduleId);
  if (!access.allowed) {
    redirect("/dashboard");
  }

  return (
    <ModulePlayer
      moduleId={access.module.id}
      title={access.module.title}
      description={access.module.description}
      thumbnail={resolveThumbnail(access.module.order, access.module.thumbnail)}
      initialSeconds={access.progress?.timerSeconds ?? 0}
      videoViewed={access.progress?.videoViewed ?? false}
      questions={publicQuestions(access.quiz)}
    />
  );
}
