import { useQuery } from '@tanstack/react-query';

import supabase from '@/src/lib/supabaseClient';
import { getDevotionalDays, getDevotionalDrafts } from '../api/queries';
export function useGetDevotionalDays(planId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-days', planId, userId],
    queryFn: async () => getDevotionalDays(planId),
    enabled: !!planId && !!userId,
  });
}

export function useGetDevotionalDrafts(planId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-drafts', planId, userId],
    queryFn: async () => getDevotionalDrafts(planId),
    enabled: !!planId && !!userId,
  });
}
