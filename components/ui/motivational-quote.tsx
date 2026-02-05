'use client';

import { useMemo } from 'react';
import { getDailyQuote } from '@/lib/data/quotes';
import { Sparkles } from 'lucide-react';

/**
 * Displays a daily motivational quote
 * The quote changes once per day based on the current date
 */
export function MotivationalQuote() {
  // Get the same quote for the entire day
  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <div className="text-center py-8 mb-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary/70" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Daily Inspiration
        </span>
        <Sparkles className="w-5 h-5 text-primary/70" />
      </div>
      <blockquote className="text-lg md:text-xl text-foreground/80 italic max-w-2xl mx-auto px-4">
        "{quote.text}"
      </blockquote>
      <cite className="text-sm text-muted-foreground mt-3 block not-italic">
        — {quote.author}
      </cite>
    </div>
  );
}
