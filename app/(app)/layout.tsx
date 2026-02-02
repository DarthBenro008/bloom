import Link from "next/link";
import { UserButton } from "@neondatabase/auth/react";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/tasks" className="font-bold text-xl text-primary">
                Bloom
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/tasks">Garden</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/tasks">Tasks</Link>
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild size="sm">
                <Link href="/tasks/new">New Task</Link>
              </Button>
              <UserButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Toast notifications */}
        <Toaster richColors position="bottom-right" />
      </div>
    </QueryProvider>
  );
}
