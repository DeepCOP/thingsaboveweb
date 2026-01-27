import {
  DevotionalDayInput,
  DevotionalPlan,
  DevotionalPlanInsert,
  DevotionalPlanUpdate,
} from '@/types/types';
import supabase from '../supabaseClient';

export async function submitDevotionalDays(planId: string, days: DevotionalDayInput[]) {
  const { error } = await supabase.rpc('publish_devotional_plan', {
    p_plan_id: planId as string,
    p_days: days,
  });

  if (error) throw error;
}

export async function createDevotionalPlan(payload: DevotionalPlanInsert) {
  const { error } = await supabase.from('devotional_plans').insert({
    id: payload.id,
    title: payload.title,
    description: payload.description,
    total_days: payload.total_days,
    author_id: payload.author_id,
    cover_image: payload.cover_image,
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
