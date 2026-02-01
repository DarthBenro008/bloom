import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTask, startTask, toggleSubtask } from '@/lib/actions/tasks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

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

async function SubtaskToggleButton({ subtaskId, isCompleted }: { subtaskId: string; isCompleted: boolean }) {
  return (
    <form action={async () => {
      'use server';
      await toggleSubtask(subtaskId);
    }}>
      <button
        type="submit"
        className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-colors ${
          isCompleted
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
        }`}
      >
        {isCompleted && '✓'}
      </button>
    </form>
  );
}

async function StartTaskButton({ taskId }: { taskId: string }) {
  return (
    <form action={async () => {
      'use server';
      await startTask(taskId);
    }}>
      <Button type="submit">Start Working</Button>
    </form>
  );
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

  const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const allSubtasksComplete = completedSubtasks === totalSubtasks && totalSubtasks > 0;

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
              <span className="font-medium">{completedSubtasks}/{totalSubtasks} steps completed</span>
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
                  <SubtaskToggleButton subtaskId={subtask.id} isCompleted={subtask.isCompleted} />
                  <span className={`flex-1 ${subtask.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
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
                  <p className="text-sm text-muted-foreground mb-1">Reflection Question</p>
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
              <StartTaskButton taskId={task.id} />
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
                    {allSubtasksComplete ? 'Mark Complete' : `Complete ${totalSubtasks - completedSubtasks} more steps`}
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
