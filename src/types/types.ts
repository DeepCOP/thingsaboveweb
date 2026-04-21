import { Database } from './supabase.gen.types';

export type DevotionalPlan = Database['public']['Tables']['devotional_plans']['Row'];

export type DevotionalPlanInsert = Database['public']['Tables']['devotional_plans']['Insert'];

export type DevotionalPlanUpdate = Database['public']['Tables']['devotional_plans']['Update'];

export type Profiles = Database['public']['Tables']['profiles']['Row'];

export type ProfilesInsert = Database['public']['Tables']['profiles']['Insert'];

export type ProfilesUpdate = Database['public']['Tables']['profiles']['Update'];

export type DevotionalDays = Database['public']['Tables']['devotional_days']['Row'];

export type DevotionalDaysInsert = Database['public']['Tables']['devotional_days']['Insert'];

export type DevotionalDaysUpdate = Database['public']['Tables']['devotional_days']['Update'];

export type ScriptureReferences = Database['public']['Tables']['scripture_references']['Row'];

export type ScriptureReferencesInsert =
  Database['public']['Tables']['scripture_references']['Insert'];

export type ScriptureReferencesUpdate =
  Database['public']['Tables']['scripture_references']['Update'];

export type Comments = Database['public']['Tables']['comments']['Row'];

export type CommentsInsert = Database['public']['Tables']['comments']['Insert'];

export type CommentsUpdate = Database['public']['Tables']['comments']['Update'];

export type PlanProgress = Database['public']['Tables']['plan_progress']['Row'];
export type PlanProgressInsert = Database['public']['Tables']['plan_progress']['Insert'];
export type PlanProgressUpdate = Database['public']['Tables']['plan_progress']['Update'];

export type DevotionalPlanView = Database['public']['Views']['devotional_plans_view']['Row'];

export type ParsedVerse = {
  book: string; // "Song of Solomon"
  chapter: number; // 2
  verseStart: number; // 1
  verseEnd?: number; // 4
};

export type Notifications = Database['public']['Tables']['notifications']['Row'];
export type NotificationsInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationsUpdate = Database['public']['Tables']['notifications']['Update'];
export type GetMyNotifications = Database['public']['Functions']['get_my_notifications']['Returns'];

export type PlanGroupMembers = Database['public']['Tables']['plan_group_members']['Row'];
export type PlanGroupMembersInsert = Database['public']['Tables']['plan_group_members']['Insert'];
export type PlanGroupMembersUpdate = Database['public']['Tables']['plan_group_members']['Update'];

export type DayItemsProgress = Database['public']['Tables']['day_items_progress']['Row'];
export type DayItemsProgressInsert = Database['public']['Tables']['day_items_progress']['Insert'];
export type DayItemsProgressUpdate = Database['public']['Tables']['day_items_progress']['Update'];

export type GetPendingFriendRequests =
  Database['public']['Functions']['get_pending_friend_requests']['Returns'];

export type DevotionalDayInput = {
  day_number: number;
  content: string;
  scriptures: string[];
  id: string;
  title?: string;
};

export type PlanSubmission = {
  id: string;
  plan_id: string;
  submission_number: number;
  status: 'submitted' | 'screening' | 'published' | 'rejected' | 'failed';
  screening_decision: 'pass' | 'reject' | 'error' | null;
  screening_summary: string | null;
  screening_reason_codes: string[];
  screening_confidence: number | null;
  submitted_at: string;
  screening_completed_at: string | null;
  published_at: string | null;
  rejected_at: string | null;
};

export type SubmitDevotionalPlanResult = {
  submission_id: string;
  plan_id: string;
  submission_number: number;
  status: 'submitted';
  submitted_at: string;
};

export type DEvotionalPlanInput = {
  planId: string;
  title: string;
  description: string;
  totalDays: number;
  coverImage: string | null;
};

export type Reports = Database['public']['Tables']['reports']['Row'];

export type GetMyDevotionalPlans =
  Database['public']['Functions']['get_my_devotional_plans']['Returns'];
