import { createClient } from '@/lib/supabase/client';
import { DevotionalDayInput } from '@/types/types';
import supabase from '../supabaseClient';

export async function getDevotionalById(id: string) {
  const { data, error } = await supabase.from('devotional_plans').select('*').eq('id', id).single();

  if (error) throw error;
  console.log('data', data);

  return data;
}

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
