"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GardenPreview } from "@/components/garden/garden-preview";
import { BreakdownChat, type ChatMessage } from "./breakdown-chat";
import type { SubtaskData, TaskBreakdown } from "@/lib/ai/types";
import type { EffortWeight } from "@/lib/db/schema";

interface TaskReviewProps {
  initialBreakdown: TaskBreakdown;
  onConfirm: (
    subtasks: SubtaskData[],
    overallWeight: EffortWeight,
    expectedOutput: string,
  ) => void;
  onModify: (userMessage: string) => Promise<void>;
  onRegenerate: () => Promise<void>;
  onBack: () => void;
  isModifying?: boolean;
}

const EFFORT_LABELS = {
  light: "Light (~1 hr)",
  medium: "Medium (2-4 hrs)",
  heavy: "Heavy (4+ hrs)",
};

export function TaskReview({
  initialBreakdown,
  onConfirm,
  onModify,
  onRegenerate,
  onBack,
  isModifying = false,
}: TaskReviewProps) {
  const [subtasks, setSubtasks] = useState<SubtaskData[]>(
    initialBreakdown.subtasks,
  );
  const [overallWeight, setOverallWeight] = useState<EffortWeight>(
    initialBreakdown.suggestedOverallWeight,
  );
  const [expectedOutput, setExpectedOutput] = useState(
    initialBreakdown.suggestedExpectedOutput,
  );
  const [newSubtask, setNewSubtask] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiSuggested, setIsAiSuggested] = useState({
    subtasks: true,
    weight: true,
    output: true,
  });

  // Update state when breakdown changes from AI modifications
  useEffect(() => {
    setSubtasks(initialBreakdown.subtasks);
    setOverallWeight(initialBreakdown.suggestedOverallWeight);
    setExpectedOutput(initialBreakdown.suggestedExpectedOutput);
  }, [initialBreakdown]);

  const updateSubtask = (index: number, updates: Partial<SubtaskData>) => {
    setSubtasks((prev) =>
      prev.map((st, i) => (i === index ? { ...st, ...updates } : st)),
    );
    setIsAiSuggested((prev) => ({ ...prev, subtasks: false }));
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length > 1) {
      setSubtasks((prev) => prev.filter((_, i) => i !== index));
      setIsAiSuggested((prev) => ({ ...prev, subtasks: false }));
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim() && subtasks.length < 6) {
      setSubtasks((prev) => [
        ...prev,
        { title: newSubtask.trim(), effortWeight: "light" },
      ]);
      setNewSubtask("");
      setIsAiSuggested((prev) => ({ ...prev, subtasks: false }));
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);

    // Call the AI modification handler
    await onModify(message);

    // Add AI response to chat
    setChatMessages((prev) => [
      ...prev,
      { role: "ai", content: "Updated your task breakdown!" },
    ]);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  const handleRegenerate = async () => {
    setChatMessages([]);
    setIsAiSuggested({ subtasks: true, weight: true, output: true });
    await onRegenerate();
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Review Your Action Plan</CardTitle>
              <CardDescription>
                AI has broken down your task. Review and adjust as needed.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isModifying}
            >
              🔄 Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Steps</h3>
              {isAiSuggested.subtasks && (
                <Badge variant="secondary" className="text-xs">
                  ✨ AI suggested
                </Badge>
              )}
            </div>
            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <span className="text-muted-foreground font-mono text-sm w-6">
                  {index + 1}.
                </span>
                <Input
                  value={subtask.title}
                  onChange={(e) =>
                    updateSubtask(index, { title: e.target.value })
                  }
                  className="flex-1"
                />
                <Select
                  value={subtask.effortWeight}
                  onValueChange={(value: EffortWeight) =>
                    updateSubtask(index, { effortWeight: value })
                  }
                >
                  <SelectTrigger className="w-[120px]">
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

            {/* Add subtask */}
            {subtasks.length < 6 && (
              <div className="flex gap-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add another step..."
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSubtask())
                  }
                />
                <Button
                  variant="outline"
                  onClick={addSubtask}
                  disabled={!newSubtask.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Expected Output */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Expected Output</h3>
              {isAiSuggested.output && (
                <Badge variant="secondary" className="text-xs">
                  ✨ AI suggested
                </Badge>
              )}
            </div>
            <Textarea
              value={expectedOutput}
              onChange={(e) => {
                setExpectedOutput(e.target.value);
                setIsAiSuggested((prev) => ({ ...prev, output: false }));
              }}
              placeholder="What will exist after this is done?"
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific and observable. What would someone see if they looked
              at your work?
            </p>
          </div>

          {/* Overall effort */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">Overall Effort</p>
                {isAiSuggested.weight && (
                  <Badge variant="secondary" className="text-xs">
                    ✨ AI suggested
                  </Badge>
                )}
              </div>
              <Select
                value={overallWeight}
                onValueChange={(value: EffortWeight) => {
                  setOverallWeight(value);
                  setIsAiSuggested((prev) => ({ ...prev, weight: false }));
                }}
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
            <p className="text-sm text-muted-foreground mt-1">
              How much this task will grow your garden
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Garden Preview */}
      <div className="px-7">
        <GardenPreview effortWeight={overallWeight} />
      </div>

      {/* Chat Interface */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <BreakdownChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClear={handleClearChat}
            isLoading={isModifying}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={onBack} disabled={isModifying}>
          ← Start Over
        </Button>
        <Button
          onClick={() => onConfirm(subtasks, overallWeight, expectedOutput)}
          disabled={!expectedOutput.trim() || isModifying}
          size="lg"
        >
          Commit & Start →
        </Button>
      </div>
    </div>
  );
}
