'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReflectionForm } from '@/components/tasks/reflection-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask, useInitiateCompletion, useCompleteTask } from '@/lib/api/hooks';
import { Loader2 } from 'lucide-react';

interface CompleteTaskPageProps {
  params: Promise<{ id: string }>;
}

export default function CompleteTaskPage({ params }: CompleteTaskPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  // Fetch task
  const { data: task, isLoading: taskLoading } = useTask(id);

  // Initiate completion (get reflection question)
  const initiateCompletion = useInitiateCompletion();
  const [reflectionQuestion, setReflectionQuestion] = useState<string | null>(null);

  // Complete task mutation
  const completeTask = useCompleteTask();

  // Load or generate reflection question
  useEffect(() => {
    if (task && !reflectionQuestion && !initiateCompletion.isPending) {
      if (task.status === 'completed') {
        router.push('/tasks');
        return;
      }

      if (task.reflectionQuestion) {
        setReflectionQuestion(task.reflectionQuestion);
      } else {
        initiateCompletion.mutate(id, {
          onSuccess: (data) => {
            setReflectionQuestion(data.question);
          },
        });
      }
    }
  }, [task, reflectionQuestion, initiateCompletion, id, router]);

  const handleSubmit = async (response: string) => {
    completeTask.mutate(
      { taskId: id, reflectionResponse: response },
      {
        onSuccess: () => {
          setIsComplete(true);
          // Show success briefly then redirect
          setTimeout(() => {
            router.push('/tasks');
          }, 2000);
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(`/tasks/${id}`);
  };

  if (taskLoading || initiateCompletion.isPending) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        isLoading={completeTask.isPending}
      />
    </div>
  );
}
