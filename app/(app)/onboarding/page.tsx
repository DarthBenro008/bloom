import { redirect } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { getOrCreateUser } from '@/lib/actions/tasks';
import { generateWelcomeMessage } from '@/lib/actions/ai';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await getOrCreateUser();

  // If user has already completed onboarding, redirect to tasks
  if (user.onboardingCompleted) {
    redirect('/tasks');
  }

  // Generate personalized welcome message
  let welcomeMessage: string | undefined;
  try {
    welcomeMessage = await generateWelcomeMessage();
  } catch {
    // Fall back to default if AI fails
    welcomeMessage = undefined;
  }

  return <OnboardingFlow welcomeMessage={welcomeMessage} />;
}
