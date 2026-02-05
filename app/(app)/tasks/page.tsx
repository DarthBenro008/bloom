"use client";

import Link from "next/link";
import { useTasks, useGarden } from "@/lib/api/hooks";
import { TaskCard } from "@/components/tasks/task-card";
import { GardenCanvas } from "@/components/garden/garden-canvas";
import { MotivationalQuote } from "@/components/ui/motivational-quote";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks();
  const { data: garden, isLoading: gardenLoading } = useGarden();

  if (tasksLoading || gardenLoading) {
    return <TasksPageSkeleton />;
  }

  if (tasksError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">
              Failed to load tasks. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tasks || !garden) {
    return null;
  }

  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "abandoned",
  );
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Motivational Quote */}
      <MotivationalQuote />

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Main content */}
        <div className="space-y-8">
          {/* Active tasks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Tasks</h2>
              {/*<Button asChild>
                <Link href="/tasks/new">New Task</Link>
              </Button>*/}
            </div>

            {activeTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No active tasks. Start something new to grow your garden!
                  </p>
                  <Button asChild>
                    <Link href="/tasks/new">Create Your First Task</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Completed</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {completedTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
              {completedTasks.length > 4 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  +{completedTasks.length - 4} more completed tasks
                </p>
              )}
            </section>
          )}
        </div>

        {/* Garden sidebar */}
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Garden</CardTitle>
              <CardDescription>
                Health: {garden.health}% | {garden.plants.length} plants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GardenCanvas plants={garden.plants} width={360} height={360} />
            </CardContent>
          </Card>

          {/* Garden stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {garden.plants.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Plants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {completedTasks.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {garden.health}%
                  </p>
                  <p className="text-xs text-muted-foreground">Health</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TasksPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-24 w-full" />
        </aside>
      </div>
    </div>
  );
}
