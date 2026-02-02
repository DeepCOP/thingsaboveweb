import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDevotionalById, getMyDevotionalPlans, getPlansReports } from '../api/queries';
import { DevotionalPlanInsert, DevotionalPlanUpdate } from '@/src/types/types';
import { createDevotionalPlan, deleteDevotionalPlan, updateDevotionalPlan } from '../api/mutations';
import { DevotionalDayInput } from '@/src/types/types';
import { submitDevotionalDays } from '../api/mutations';

export function useGetDevotionalById(id: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-plan', id, userId],
    enabled: !!id && !!userId,
    queryFn: async () => getDevotionalById(id),
  });
}

export function useMyDevotionalPlans(user_id: string | undefined) {
  return useQuery({
    queryKey: ['my-devotional-plans', user_id],
    enabled: !!user_id,
    queryFn: async () => getMyDevotionalPlans(),
  });
}

export function useGetPlanReports(user_id: string | undefined, planIds: string[]) {
  return useQuery({
    queryKey: ['my-devotiional-plans-reports', user_id, planIds],
    enabled: !!user_id && !!planIds.length,
    queryFn: async () => getPlansReports(planIds),
  });
}

export function useUpdateDevotionalPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: DevotionalPlanUpdate) => updateDevotionalPlan(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-devotional-plans'] });
    },
  });
}

export function useCreateDevotionalPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: DevotionalPlanInsert) => createDevotionalPlan(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-devotional-plans'] });
    },
  });
}

export function useDeleteDevotionalPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: string) => deleteDevotionalPlan(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-devotional-plans'] });
    },
  });
}

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
