'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Task, Subtask } from '@/lib/db/schema';

interface TaskCardProps {
  task: Task & { subtasks: Subtask[] };
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

const EFFORT_LABELS = {
  light: 'Light',
  medium: 'Medium',
  heavy: 'Heavy',
};

export function TaskCard({ task }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(st => st.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
          <Badge variant="secondary" className={STATUS_COLORS[task.status]}>
            {STATUS_LABELS[task.status]}
          </Badge>
        </div>
        {task.completionContract && (
          <CardDescription className="line-clamp-2">
            Goal: {task.completionContract}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSubtasks}/{totalSubtasks} steps</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtasks preview */}
        {task.subtasks.length > 0 && (
          <ul className="mt-4 space-y-1">
            {task.subtasks.slice(0, 3).map((subtask) => (
              <li
                key={subtask.id}
                className={`text-sm flex items-center gap-2 ${
                  subtask.isCompleted ? 'text-muted-foreground line-through' : ''
                }`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  subtask.isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'
                }`}>
                  {subtask.isCompleted && '✓'}
                </span>
                <span className="truncate">{subtask.title}</span>
              </li>
            ))}
            {task.subtasks.length > 3 && (
              <li className="text-sm text-muted-foreground">
                +{task.subtasks.length - 3} more steps
              </li>
            )}
          </ul>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline">{EFFORT_LABELS[task.effortWeight]}</Badge>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/tasks/${task.id}`}>
              {task.status === 'completed' ? 'View' : 'Continue'}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
