import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DevotionalDayInput } from '@/src/types/types';
import { submitDevotionalDays } from '../api/mutations';

export function useSubmitDevotionalDays(planId: string, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days: DevotionalDayInput[]) => submitDevotionalDays(planId, days),

    onSuccess: () => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({
        queryKey: ['devotional-plan', planId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['devotional-drafts', planId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['devotional-days', planId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['my-devotional-plans', userId],
      });
    },
  });
}
