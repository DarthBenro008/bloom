'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskInput } from '@/components/tasks/task-input';
import { SubtaskList } from '@/components/tasks/subtask-list';
import { CommitmentForm } from '@/components/tasks/commitment-form';
import { GardenPreview } from '@/components/garden/garden-preview';
import { breakdownTask, type SubtaskData } from '@/lib/actions/ai';
import { createTask } from '@/lib/actions/tasks';
import type { EffortWeight } from '@/lib/db/schema';

type Step = 'input' | 'breakdown' | 'commitment';

export default function NewTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('input');
  const [isLoading, setIsLoading] = useState(false);

  // Task data
  const [vagueTask, setVagueTask] = useState('');
  const [subtasks, setSubtasks] = useState<SubtaskData[]>([]);
  const [overallWeight, setOverallWeight] = useState<EffortWeight>('medium');

  const handleTaskInput = async (task: string) => {
    setVagueTask(task);
    setIsLoading(true);
    try {
      const breakdown = await breakdownTask(task);
      setSubtasks(breakdown.subtasks);
      setOverallWeight(breakdown.suggestedOverallWeight);
      setStep('breakdown');
    } catch (error) {
      console.error('Failed to break down task:', error);
      // Fallback to manual entry
      setSubtasks([{ title: 'Complete the main task', effortWeight: 'medium' }]);
      setStep('breakdown');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakdownConfirm = (updatedSubtasks: SubtaskData[], weight: EffortWeight) => {
    setSubtasks(updatedSubtasks);
    setOverallWeight(weight);
    setStep('commitment');
  };

  const handleCommitment = async (commitment: string) => {
    setIsLoading(true);
    try {
      const task = await createTask({
        title: vagueTask,
        completionContract: commitment,
        effortWeight: overallWeight,
        subtasks: subtasks.map(st => ({
          title: st.title,
          effortWeight: st.effortWeight as EffortWeight,
        })),
      });
      router.push(`/tasks/${task.id}`);
    } catch (error) {
      console.error('Failed to create task:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          {(['input', 'breakdown', 'commitment'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : i < ['input', 'breakdown', 'commitment'].indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-16 h-0.5 ${
                    i < ['input', 'breakdown', 'commitment'].indexOf(step)
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
          {step === 'breakdown' && 'Step 2: Review your action plan'}
          {step === 'commitment' && 'Step 3: Make your commitment'}
        </div>
      </div>

      {/* Step content */}
      {step === 'input' && (
        <TaskInput onSubmit={handleTaskInput} isLoading={isLoading} />
      )}

      {step === 'breakdown' && (
        <div className="space-y-6">
          <SubtaskList
            subtasks={subtasks}
            suggestedWeight={overallWeight}
            onConfirm={handleBreakdownConfirm}
            onBack={() => setStep('input')}
          />
          <GardenPreview effortWeight={overallWeight} />
        </div>
      )}

      {step === 'commitment' && (
        <CommitmentForm
          taskTitle={vagueTask}
          onSubmit={handleCommitment}
          onBack={() => setStep('breakdown')}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
