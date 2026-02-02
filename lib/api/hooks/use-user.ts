import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UserResponse } from '@/lib/api/types';

export const userKeys = {
  me: ['user', 'me'] as const,
};

/**
 * Get or create current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: async (): Promise<UserResponse> => {
      const res = await fetch('/api/users/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });
}

/**
 * Complete onboarding
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/users/complete-onboarding', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to complete onboarding');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me });
      toast.success('Welcome to Bloom!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to complete onboarding');
    },
  });
}
