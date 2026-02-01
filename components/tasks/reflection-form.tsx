'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReflectionFormProps {
  question: string;
  taskTitle: string;
  completionContract: string;
  onSubmit: (response: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReflectionForm({
  question,
  taskTitle,
  completionContract,
  onSubmit,
  onCancel,
  isLoading,
}: ReflectionFormProps) {
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim()) {
      onSubmit(response.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Almost there!</CardTitle>
        <CardDescription>
          Take a moment to reflect on what you accomplished.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task context */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-xs text-muted-foreground">Task</p>
              <p className="font-medium">{taskTitle}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">You committed to create</p>
              <p className="font-medium">{completionContract}</p>
            </div>
          </div>

          {/* Reflection question */}
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <p className="text-lg font-medium text-center">{question}</p>
            </div>

            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Be specific about what you accomplished..."
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your reflection helps your garden grow. Honest, specific answers lead to the healthiest plants.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Not done yet
            </Button>
            <Button type="submit" disabled={!response.trim() || isLoading}>
              {isLoading ? 'Updating garden...' : 'Complete Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
