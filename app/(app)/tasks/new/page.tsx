'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskInput } from '@/components/tasks/task-input';
import { TaskReview } from '@/components/tasks/task-review';
import { breakdownTask, modifyBreakdown } from '@/lib/api/ai';
import type { SubtaskData, TaskBreakdown } from '@/lib/ai/types';
import { useCreateTask } from '@/lib/api/hooks';
import type { EffortWeight } from '@/lib/db/schema';

type Step = 'input' | 'review';

export default function NewTaskPage() {
  const router = useRouter();
  const createTask = useCreateTask();
  const [step, setStep] = useState<Step>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  // Task data
  const [vagueTask, setVagueTask] = useState('');
  const [currentBreakdown, setCurrentBreakdown] = useState<TaskBreakdown | null>(null);

  const handleTaskInput = async (task: string) => {
    setVagueTask(task);
    setIsLoading(true);
    try {
      const breakdown = await breakdownTask(task);
      setCurrentBreakdown(breakdown);
      setStep('review');
    } catch (error) {
      console.error('Failed to break down task:', error);
      // Fallback to manual entry
      setCurrentBreakdown({
        subtasks: [{ title: 'Complete the main task', effortWeight: 'medium' }],
        suggestedOverallWeight: 'medium',
        suggestedExpectedOutput: 'Task completed',
      });
      setStep('review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModify = async (userMessage: string) => {
    if (!currentBreakdown) return;
    
    setIsModifying(true);
    try {
      const updatedBreakdown = await modifyBreakdown(vagueTask, currentBreakdown, userMessage);
      setCurrentBreakdown(updatedBreakdown);
    } catch (error) {
      console.error('Failed to modify breakdown:', error);
    } finally {
      setIsModifying(false);
    }
  };

  const handleRegenerate = async () => {
    setIsModifying(true);
    try {
      const breakdown = await breakdownTask(vagueTask);
      setCurrentBreakdown(breakdown);
    } catch (error) {
      console.error('Failed to regenerate breakdown:', error);
    } finally {
      setIsModifying(false);
    }
  };

  const handleConfirm = async (
    subtasks: SubtaskData[], 
    overallWeight: EffortWeight, 
    expectedOutput: string
  ) => {
    setIsLoading(true);
    createTask.mutate(
      {
        title: vagueTask,
        completionContract: expectedOutput,
        effortWeight: overallWeight,
        subtasks: subtasks.map(st => ({
          title: st.title,
          effortWeight: st.effortWeight as EffortWeight,
        })),
      },
      {
        onSuccess: (task) => {
          router.push(`/tasks/${task.id}`);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          {(['input', 'review'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : i < ['input', 'review'].indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    i < ['input', 'review'].indexOf(step)
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {step === 'input' && 'Step 1: Tell me what you want to work on'}
          {step === 'review' && 'Step 2: Review and refine your plan'}
        </div>
      </div>

      {/* Step content */}
      {step === 'input' && (
        <TaskInput onSubmit={handleTaskInput} isLoading={isLoading} />
      )}

      {step === 'review' && currentBreakdown && (
        <TaskReview
          initialBreakdown={currentBreakdown}
          onConfirm={handleConfirm}
          onModify={handleModify}
          onRegenerate={handleRegenerate}
          onBack={() => setStep('input')}
          isModifying={isModifying}
        />
      )}
    </div>
  );
}
