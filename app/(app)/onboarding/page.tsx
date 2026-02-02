'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { useCurrentUser } from '@/lib/api/hooks';
import { generateWelcomeMessage } from '@/lib/api/ai';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [welcomeMessage, setWelcomeMessage] = useState<string | undefined>();
  const [messageLoading, setMessageLoading] = useState(true);

  // Check if user has completed onboarding
  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.push('/tasks');
    }
  }, [user, router]);

  // Generate welcome message
  useEffect(() => {
    async function loadWelcomeMessage() {
      try {
        const message = await generateWelcomeMessage();
        setWelcomeMessage(message);
      } catch (error) {
        console.error('Failed to generate welcome message:', error);
        // Continue without AI message
      } finally {
        setMessageLoading(false);
      }
    }

    if (user && !user.onboardingCompleted) {
      loadWelcomeMessage();
    }
  }, [user]);

  if (isLoading || messageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Preparing your welcome...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || user.onboardingCompleted) {
    return null;
  }

  return <OnboardingFlow welcomeMessage={welcomeMessage} />;
}
