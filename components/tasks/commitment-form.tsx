'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CommitmentFormProps {
  taskTitle: string;
  onSubmit: (commitment: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function CommitmentForm({ taskTitle, onSubmit, onBack, isLoading }: CommitmentFormProps) {
  const [commitment, setCommitment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commitment.trim()) {
      onSubmit(commitment.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>What will exist after this is done?</CardTitle>
        <CardDescription>
          This becomes your completion contract. Be specific about what you&apos;ll create.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Your task:</p>
            <p className="font-medium">{taskTitle}</p>
          </div>

          <div className="space-y-2">
            <Textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="e.g., A deployed landing page, Three written bullet points, A working prototype..."
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Good answers are concrete and observable. What would someone see if they looked at your work?
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              Back
            </Button>
            <Button type="submit" disabled={!commitment.trim() || isLoading}>
              {isLoading ? 'Creating task...' : 'Commit & Start'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
