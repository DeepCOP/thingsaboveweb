import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { saveDevotionalDraft } from '../api/mutations';

export function useSaveDevotionalDraft(planId: string) {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (days: any[]) => saveDevotionalDraft(days, planId),
  });
}
