import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDevotionalById,
  getLatestPlanSubmission,
  getMyDevotionalPlans,
  getPlansReports,
  fetchPlanTags,
} from '../api/queries';
import { DevotionalPlanInsert, DevotionalPlanUpdate } from '@/src/types/types';
import { createDevotionalPlan, deleteDevotionalPlan, updateDevotionalPlan } from '../api/mutations';
import { DevotionalDayInput } from '@/src/types/types';
import { submitDevotionalPlanForScreening } from '../api/mutations';

export function useGetDevotionalById(id: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-plan', id, userId],
    enabled: !!id && !!userId,
    queryFn: async () => getDevotionalById(id),
  });
}

export const usePlanTags = () => {
  return useQuery({
    queryKey: ['plan_tags'],
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    queryFn: async () => fetchPlanTags(),
  });
};

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

export function useLatestPlanSubmission(planId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['plan-submission', planId, userId],
    enabled: !!planId && !!userId,
    queryFn: async () => getLatestPlanSubmission(planId),
    refetchInterval: (query) => {
      const submission = query.state.data;
      if (!submission) return false;

      return submission.status === 'submitted' || submission.status === 'screening' ? 3000 : false;
    },
  });
}

export function useUpdateDevotionalPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: DevotionalPlanUpdate) => updateDevotionalPlan(input),
    onSuccess: (_, input) => {
      qc.invalidateQueries({ queryKey: ['my-devotional-plans'] });
      if (input.id) {
        qc.invalidateQueries({ queryKey: ['devotional-plan', input.id] });
      }
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
    onSuccess: (_, planId) => {
      qc.invalidateQueries({ queryKey: ['my-devotional-plans'] });
      qc.invalidateQueries({ queryKey: ['devotional-plan', planId] });
      qc.invalidateQueries({ queryKey: ['devotional-drafts', planId] });
      qc.invalidateQueries({ queryKey: ['devotional-days', planId] });
    },
  });
}

export function useSubmitDevotionalPlanForScreening(planId: string, userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days: DevotionalDayInput[]) => submitDevotionalPlanForScreening(planId, days),

    onSuccess: () => {
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
      queryClient.invalidateQueries({
        queryKey: ['plan-submission', planId, userId],
      });
    },
  });
}
