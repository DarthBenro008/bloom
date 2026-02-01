'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskInputProps {
  onSubmit: (task: string) => void;
  isLoading?: boolean;
}

export function TaskInput({ onSubmit, isLoading }: TaskInputProps) {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>What do you want to work on?</CardTitle>
        <CardDescription>
          Don&apos;t worry about being specific. Just tell me what&apos;s on your mind.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., Work on my startup, Prepare for the interview, Study for the exam..."
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!task.trim() || isLoading}>
              {isLoading ? 'Breaking it down...' : 'Break it down'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
