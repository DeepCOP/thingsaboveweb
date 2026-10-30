import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDevotionalDraft } from '../api/mutations';
import type { DevotionalDayInput } from '../types/types';

export function useSaveDevotionalDraft(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: DevotionalDayInput[]) => saveDevotionalDraft(days, planId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['devotional-drafts', planId] }),
        queryClient.invalidateQueries({ queryKey: ['my-devotional-plans'] }),
      ]),
  });
}
