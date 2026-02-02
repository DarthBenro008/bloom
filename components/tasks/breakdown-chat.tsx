'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface BreakdownChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export function BreakdownChat({ messages, onSendMessage, onClear, isLoading }: BreakdownChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Modify with AI</h3>
          <p className="text-sm text-muted-foreground">
            Ask me to make changes: "make this simpler", "add a testing step", etc.
          </p>
        </div>
        {messages.length > 0 && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear chat
          </Button>
        )}
      </div>

      {/* Chat messages */}
      {messages.length > 0 && (
        <Card className="max-h-[300px] overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Make this simpler, I only have 2 hours..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? 'Updating...' : 'Send'}
        </Button>
      </form>

      {/* Quick suggestions */}
      {messages.length === 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => !isLoading && onSendMessage('Make this simpler')}
            disabled={isLoading}
          >
            Make simpler
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => !isLoading && onSendMessage('Add a testing step')}
            disabled={isLoading}
          >
            Add testing step
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => !isLoading && onSendMessage('This is too complex, give me fewer steps')}
            disabled={isLoading}
          >
            Fewer steps
          </Button>
        </div>
      )}
    </div>
  );
}
