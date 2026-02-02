'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTask, useStartTask, useToggleSubtask } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  abandoned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const STATUS_LABELS = {
  pending: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  abandoned: 'Abandoned',
};

export default function TaskPage({ params }: TaskPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: task, isLoading, error } = useTask(id);
  const startTask = useStartTask();
  const toggleSubtask = useToggleSubtask();

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error || !task) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Task not found</p>
            <Button onClick={() => router.push('/tasks')} className="mt-4">
              Back to Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedSubtasks = task.subtasks.filter((st) => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const allSubtasksComplete =
    completedSubtasks === totalSubtasks && totalSubtasks > 0;

  const handleStartTask = () => {
    startTask.mutate(id);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtask.mutate({ subtaskId, taskId: id });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tasks">&larr; Back to Tasks</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              {task.completionContract && (
                <CardDescription>
                  <span className="font-medium">Goal:</span> {task.completionContract}
                </CardDescription>
              )}
            </div>
            <Badge variant="secondary" className={STATUS_COLORS[task.status]}>
              {STATUS_LABELS[task.status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedSubtasks}/{totalSubtasks} steps completed
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <h3 className="font-medium">Steps</h3>
            <ul className="space-y-2">
              {task.subtasks.map((subtask) => (
                <li
                  key={subtask.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    subtask.isCompleted ? 'bg-muted/30' : 'bg-muted/50'
                  }`}
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    disabled={toggleSubtask.isPending}
                    className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors disabled:opacity-50 ${
                      subtask.isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {toggleSubtask.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      subtask.isCompleted && '✓'
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      subtask.isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {subtask.effortWeight}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* Completion info for completed tasks */}
          {task.status === 'completed' && (
            <div className="pt-4 border-t space-y-4">
              {task.reflectionQuestion && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Reflection Question
                  </p>
                  <p className="font-medium">{task.reflectionQuestion}</p>
                </div>
              )}
              {task.reflectionResponse && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Response</p>
                  <p>{task.reflectionResponse}</p>
                </div>
              )}
              {task.completedAt && (
                <p className="text-sm text-muted-foreground">
                  Completed on {new Date(task.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </CardContent>

        {task.status !== 'completed' && task.status !== 'abandoned' && (
          <CardFooter className="flex justify-between">
            {task.status === 'pending' ? (
              <Button
                onClick={handleStartTask}
                disabled={startTask.isPending}
                className="w-full"
              >
                {startTask.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  'Start Working'
                )}
              </Button>
            ) : (
              <div className="flex gap-4 w-full">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/tasks">Continue Later</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1"
                  disabled={!allSubtasksComplete}
                >
                  <Link href={`/tasks/${task.id}/complete`}>
                    {allSubtasksComplete
                      ? 'Mark Complete'
                      : `Complete ${totalSubtasks - completedSubtasks} more steps`}
                  </Link>
                </Button>
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function TaskDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Skeleton className="h-10 w-32 mb-6" />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-20" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
