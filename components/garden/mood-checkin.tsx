'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MOODS = [
  { emoji: '😊', label: 'Great', value: 'great' },
  { emoji: '😌', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😔', label: 'Not great', value: 'not_great' },
  { emoji: '😫', label: 'Struggling', value: 'struggling' },
];

interface MoodResponse {
  aiResponse: string;
  mood: string;
}

export function MoodCheckin() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const queryClient = useQueryClient();

  const submitMood = useMutation({
    mutationFn: async () => {
      if (!selectedMood) throw new Error('No mood selected');
      
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, note: note.trim() || null }),
      });

      if (!response.ok) throw new Error('Failed to submit mood');
      return response.json() as Promise<MoodResponse>;
    },
    onSuccess: (data) => {
      setAiResponse(data.aiResponse);
      setShowResponse(true);
      queryClient.invalidateQueries({ queryKey: ['moods'] });
      
      // Reset form after a delay
      setTimeout(() => {
        setSelectedMood(null);
        setNote('');
      }, 500);
    },
  });

  const handleSubmit = () => {
    if (selectedMood) {
      submitMood.mutate();
    }
  };

  const handleDismiss = () => {
    setShowResponse(false);
    setAiResponse(null);
  };

  return (
    <div className="space-y-4">
      {/* AI Response Card */}
      {showResponse && aiResponse && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
            <p className="text-sm leading-relaxed pr-6">{aiResponse}</p>
          </CardContent>
        </Card>
      )}

      {/* Mood Check-in Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How are you feeling today?</CardTitle>
          <CardDescription>Let us know so we can support you better</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood selector */}
          <div className="flex gap-2 justify-between">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                  ${selectedMood === mood.value 
                    ? 'bg-primary/10 ring-2 ring-primary scale-110' 
                    : 'hover:bg-muted hover:scale-105'
                  }
                `}
                disabled={submitMood.isPending}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-muted-foreground">{mood.label}</span>
              </button>
            ))}
          </div>

          {/* Optional note */}
          {selectedMood && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Textarea
                placeholder="Want to share more? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={2}
                disabled={submitMood.isPending}
              />
              <Button
                onClick={handleSubmit}
                disabled={submitMood.isPending}
                className="w-full"
              >
                {submitMood.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Share'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
