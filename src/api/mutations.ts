import { DevotionalDayInput, DevotionalPlanInsert, DevotionalPlanUpdate } from '@/src/types/types';
import supabase from '../lib/supabaseClient';

export async function submitDevotionalPlanForScreening(planId: string, days: DevotionalDayInput[]) {
  await saveDevotionalDraft(days, planId);

  const { data, error } = await supabase.rpc('submit_devotional_plan_for_screening', {
    p_plan_id: planId as string,
  });

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function createDevotionalPlan(payload: DevotionalPlanInsert) {
  const { error } = await supabase.from('devotional_plans').insert({
    id: payload.id,
    title: payload.title,
    description: payload.description,
    total_days: payload.total_days,
    author_id: payload.author_id,
    cover_image: payload.cover_image,
    tags: payload.tags,
    visibility: payload.visibility,
  });

  if (error) throw error;
}

export const saveDevotionalDraft = async (days: DevotionalDayInput[], planId: string) => {
  if (!planId) return;

  const { error } = await supabase.rpc('save_devotional_draft', {
    _plan_id: planId,
    _days: days,
  });

  if (error) throw error;
};

export const updateDevotionalPlan = async (input: DevotionalPlanUpdate) => {
  if (!input.id) {
    return;
  }

  const { error } = await supabase
    .from('devotional_plans')
    .update({
      title: input.title,
      description: input.description,
      total_days: input.total_days,
      cover_image: input.cover_image,
      tags: input.tags,
      visibility: input.visibility,
    })
    .eq('id', input.id);

  if (error) throw error;
};

export const deleteDevotionalPlan = async (planId: string) => {
  const { error } = await supabase
    .from('devotional_plans')
    .delete({ count: 'exact' })
    .eq('id', planId);

  if (error) throw error;
};
