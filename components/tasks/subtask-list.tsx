'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubtaskData } from '@/lib/actions/ai';
import type { EffortWeight } from '@/lib/db/schema';

interface SubtaskListProps {
  subtasks: SubtaskData[];
  suggestedWeight: EffortWeight;
  onConfirm: (subtasks: SubtaskData[], overallWeight: EffortWeight) => void;
  onBack: () => void;
}

const EFFORT_COLORS = {
  light: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  heavy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const EFFORT_LABELS = {
  light: 'Light (~30 min)',
  medium: 'Medium (1-2 hrs)',
  heavy: 'Heavy (2+ hrs)',
};

export function SubtaskList({ subtasks: initialSubtasks, suggestedWeight, onConfirm, onBack }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<SubtaskData[]>(initialSubtasks);
  const [overallWeight, setOverallWeight] = useState<EffortWeight>(suggestedWeight);
  const [newSubtask, setNewSubtask] = useState('');

  const updateSubtask = (index: number, updates: Partial<SubtaskData>) => {
    setSubtasks(prev => prev.map((st, i) => 
      i === index ? { ...st, ...updates } : st
    ));
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length > 1) {
      setSubtasks(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim() && subtasks.length < 6) {
      setSubtasks(prev => [...prev, { title: newSubtask.trim(), effortWeight: 'light' }]);
      setNewSubtask('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Here&apos;s your action plan</CardTitle>
        <CardDescription>
          Review and adjust these steps. You can edit, remove, or add more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subtasks */}
        <div className="space-y-3">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground font-mono text-sm w-6">{index + 1}.</span>
              <Input
                value={subtask.title}
                onChange={(e) => updateSubtask(index, { title: e.target.value })}
                className="flex-1"
              />
              <Select
                value={subtask.effortWeight}
                onValueChange={(value: EffortWeight) => updateSubtask(index, { effortWeight: value })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeSubtask(index)}
                disabled={subtasks.length <= 1}
              >
                <span className="sr-only">Remove</span>
                &times;
              </Button>
            </div>
          ))}
        </div>

        {/* Add subtask */}
        {subtasks.length < 6 && (
          <div className="flex gap-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add another step..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
            />
            <Button variant="outline" onClick={addSubtask} disabled={!newSubtask.trim()}>
              Add
            </Button>
          </div>
        )}

        {/* Overall effort */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Overall Effort</p>
              <p className="text-sm text-muted-foreground">How much this task will grow your garden</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={overallWeight}
                onValueChange={(value: EffortWeight) => setOverallWeight(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{EFFORT_LABELS.light}</SelectItem>
                  <SelectItem value="medium">{EFFORT_LABELS.medium}</SelectItem>
                  <SelectItem value="heavy">{EFFORT_LABELS.heavy}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Effort legend */}
        <div className="flex gap-2 flex-wrap">
          {(['light', 'medium', 'heavy'] as const).map((weight) => (
            <Badge key={weight} variant="secondary" className={EFFORT_COLORS[weight]}>
              {weight === 'light' && 'Light = Quick flowers'}
              {weight === 'medium' && 'Medium = Vibrant blooms'}
              {weight === 'heavy' && 'Heavy = Majestic trees'}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Start Over
          </Button>
          <Button onClick={() => onConfirm(subtasks, overallWeight)}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
