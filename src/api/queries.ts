import { DevotionalDayInput, PlanSubmission } from '@/src/types/types';
import supabase from '../lib/supabaseClient';

export async function getDevotionalById(id: string) {
  const { data, error } = await supabase.from('devotional_plans').select('*').eq('id', id).single();

  if (error) throw error;
  console.log('data', data);

  return data;
}

export const fetchPlanTags = async () => {
  const { data, error } = await supabase.rpc('plan_tags');

  if (error) throw error;

  return data ?? [];
};

export const getDevotionalDrafts = async (planId: string) => {
  const { data, error } = await supabase.rpc('get_devotional_drafts', {
    _plan_id: planId,
  });

  if (error) throw error;
  return data;
};

export const getPlansReports = async (planIds: string[]) => {
  const { data, error } = await supabase.from('reports').select('*').in('plan_id', planIds);

  if (error) {
    throw error;
  }

  return data;
};

export const getMyDevotionalPlans = async () => {
  const { data, error } = await supabase.rpc('get_my_devotional_plans');
  if (error) throw error;
  return data;
};

export const getDevotionalDays = async (planId: string) => {
  const { data, error } = await supabase.rpc('get_devotional_days_with_scriptures', {
    p_plan_id: planId,
  });

  if (error) throw error;
  return data;
};

export const getLatestPlanSubmission = async (planId: string) => {
  const { data, error } = await supabase
    .from('plan_submissions')
    .select(
      'id, plan_id, submission_number, status, screening_decision, screening_summary, screening_reason_codes, screening_confidence, submitted_at, screening_completed_at, published_at, rejected_at',
    )
    .eq('plan_id', planId)
    .order('submission_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as PlanSubmission | null;
};
