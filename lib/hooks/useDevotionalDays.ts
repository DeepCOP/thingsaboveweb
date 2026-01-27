import { useQuery } from '@tanstack/react-query';

import supabase from '@/lib/supabaseClient';
import { getDevotionalDrafts } from '../api/queries';
export function useDevotionalDays(planId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-days', planId, userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_devotional_days_with_scriptures', {
        p_plan_id: planId,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!planId && !!userId,
  });
}

export function useGetDevotionalDrafts(planId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-drafts', planId, userId],
    queryFn: planId ? async () => getDevotionalDrafts(planId) : () => [],
    enabled: !!planId && !!userId,
  });
}
