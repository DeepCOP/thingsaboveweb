import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDevotionalDraft } from '../api/mutations';

export function useSaveDevotionalDraft(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: any[]) => saveDevotionalDraft(days, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['devotional-drafts', planId],
      });
    },
  });
}
