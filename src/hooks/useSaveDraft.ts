import { useMutation } from '@tanstack/react-query';
import { saveDevotionalDraft } from '../api/mutations';

export function useSaveDevotionalDraft(planId: string) {
  return useMutation({
    mutationFn: async (days: any[]) => saveDevotionalDraft(days, planId),
  });
}
