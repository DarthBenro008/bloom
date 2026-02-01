import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/tasks";

export const dynamic = "force-dynamic";

export default async function AppHomePage() {
  const user = await getOrCreateUser();

  // New users go to onboarding
  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  // Existing users go to tasks
  redirect("/tasks");
}
