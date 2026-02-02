import { useQuery } from '@tanstack/react-query';
import type { GardenResponse } from '@/lib/api/types';

export const gardenKeys = {
  all: ['garden'] as const,
};

/**
 * Get user's garden
 */
export function useGarden() {
  return useQuery({
    queryKey: gardenKeys.all,
    queryFn: async (): Promise<GardenResponse> => {
      const res = await fetch('/api/garden');
      if (!res.ok) throw new Error('Failed to fetch garden');
      return res.json();
    },
  });
}
