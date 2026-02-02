import { redirect } from "next/navigation";
import { AuthView } from "@neondatabase/auth/react";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: "sign-in" },
    { path: "sign-up" },
    { path: "sign-out" },
  ];
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  // If user is already authenticated and trying to sign-in/sign-up, redirect to tasks
  if (path === "sign-in" || path === "sign-up") {
    const session = await auth.getSession();
    if (session?.data?.user) {
      redirect("/tasks");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Bloom</h1>
        <p className="text-muted-foreground">Do the work. Watch it bloom.</p>
      </div>
      <AuthView path={path} />
    </main>
  );
}
