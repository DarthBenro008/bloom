'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReflectionForm } from '@/components/tasks/reflection-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initiateCompletion, completeTask, getTask } from '@/lib/actions/tasks';
import type { Task, Subtask } from '@/lib/db/schema';

interface CompleteTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function CompleteTaskPage({ params }: CompleteTaskPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<(Task & { subtasks: Subtask[] }) | null>(null);
  const [reflectionQuestion, setReflectionQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function loadTask() {
      const { id } = await params;
      const taskData = await getTask(id);
      
      if (!taskData || taskData.status === 'completed') {
        router.push('/tasks');
        return;
      }

      setTask(taskData);

      // Generate or get existing reflection question
      if (taskData.reflectionQuestion) {
        setReflectionQuestion(taskData.reflectionQuestion);
      } else {
        const question = await initiateCompletion(id);
        setReflectionQuestion(question);
      }

      setIsLoading(false);
    }

    loadTask();
  }, [params, router]);

  const handleSubmit = async (response: string) => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      await completeTask(task.id, response);
      setIsComplete(true);
      
      // Show success briefly then redirect
      setTimeout(() => {
        router.push('/tasks');
      }, 2000);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (task) {
      router.push(`/tasks/${task.id}`);
    } else {
      router.push('/tasks');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Preparing your reflection...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-primary">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <CardTitle className="text-2xl text-primary">Task Complete!</CardTitle>
            <CardDescription>
              Your garden is growing. Redirecting to your tasks...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!task || !reflectionQuestion) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Something went wrong. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ReflectionForm
        question={reflectionQuestion}
        taskTitle={task.title}
        completionContract={task.completionContract || 'Something meaningful'}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </div>
  );
}
