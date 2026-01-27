import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDevotionalById, getMyDevotionalPlans, getPlansReports } from '../api/queries';
import { DEvotionalPlanInput, DevotionalPlanInsert, DevotionalPlanUpdate } from '@/types/types';
import supabase from '../supabaseClient';
import { createDevotionalPlan, deleteDevotionalPlan, updateDevotionalPlan } from '../api/mutations';

export function useGetDevotionalById(id: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['devotional-plan', id, userId],
    enabled: !!id && !!userId,
    queryFn: id && userId ? async () => getDevotionalById(id) : () => undefined,
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
    queryFn: !!user_id && !!planIds.length ? async () => getPlansReports(planIds) : () => [],
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
