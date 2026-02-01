'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { completeOnboarding } from '@/lib/actions/tasks';

interface OnboardingFlowProps {
  welcomeMessage?: string;
}

const STEPS = [
  {
    title: 'Welcome to Bloom',
    description: 'Your work grows a garden',
    content: (
      <div className="text-center space-y-4">
        <div className="text-6xl">🌱</div>
        <p className="text-lg">
          Bloom turns your productivity into something you can see and nurture.
          Every task you complete honestly helps your garden grow.
        </p>
      </div>
    ),
  },
  {
    title: 'How It Works',
    description: 'Three simple steps',
    content: (
      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            1
          </div>
          <div>
            <p className="font-medium">Tell us what you want to work on</p>
            <p className="text-sm text-muted-foreground">
              Even vague goals like &quot;work on my startup&quot; are fine.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            2
          </div>
          <div>
            <p className="font-medium">Get clarity and commit</p>
            <p className="text-sm text-muted-foreground">
              AI breaks it down into concrete steps. You commit to what will exist when you&apos;re done.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            3
          </div>
          <div>
            <p className="font-medium">Complete and reflect</p>
            <p className="text-sm text-muted-foreground">
              When you&apos;re done, a quick reflection grows your garden.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'The Garden Reflects Truth',
    description: 'Honest work creates lasting beauty',
    content: (
      <div className="text-center space-y-6">
        <div className="flex justify-center gap-8">
          <div className="space-y-2">
            <div className="text-4xl">🌸</div>
            <p className="text-sm font-medium text-primary">Honest work</p>
            <p className="text-xs text-muted-foreground">Vibrant growth</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl opacity-50">🥀</div>
            <p className="text-sm font-medium text-muted-foreground">Skipped tasks</p>
            <p className="text-xs text-muted-foreground">Visible withering</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your garden becomes a visual story of your discipline.
          No streaks, no reminders—just natural consequences.
        </p>
      </div>
    ),
  },
  {
    title: 'Ready to Start?',
    description: 'Your garden awaits',
    content: (
      <div className="text-center space-y-4">
        <div className="text-6xl">🌳</div>
        <p className="text-lg">
          Create your first task and watch your garden begin to grow.
        </p>
        <p className="text-sm text-muted-foreground">
          Remember: the goal isn&apos;t perfection—it&apos;s honest progress.
        </p>
      </div>
    ),
  },
];

export function OnboardingFlow({ welcomeMessage }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      setIsCompleting(true);
      await completeOnboarding();
      router.push('/tasks/new');
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    await completeOnboarding();
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                  i === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CardTitle>{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          {step === 0 && welcomeMessage ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">🌱</div>
              <p className="text-lg">{welcomeMessage}</p>
            </div>
          ) : (
            currentStep.content
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {step > 0 ? (
              <Button variant="ghost" onClick={handleBack} disabled={isCompleting}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip} disabled={isCompleting}>
                Skip intro
              </Button>
            )}
          </div>
          <Button onClick={handleNext} disabled={isCompleting}>
            {isLastStep ? 'Create First Task' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
