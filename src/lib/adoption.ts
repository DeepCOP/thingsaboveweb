import 'server-only';

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/supabase.gen.types';
import type { AdoptionAvatar, AdoptionMetrics } from '@/src/types/adoption';

type ProfileLite = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'first_name' | 'last_name' | 'created_at' | 'last_seen'
>;

type BehaviorSnapshotLite = Pick<
  Database['public']['Views']['user_behavior_snapshot']['Row'],
  'user_id' | 'last_activity_at' | 'last_seen'
>;

const AVATAR_CLASSES = [
  'bg-[#1aa37a] text-white',
  'bg-[#2466b4] text-white',
  'bg-[#0f766e] text-white',
];

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables for adoption metrics');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function toDate(value: string | null | undefined) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getInitial(profile: Pick<ProfileLite, 'first_name' | 'last_name'>) {
  const initial = profile.first_name?.trim()?.charAt(0) || profile.last_name?.trim()?.charAt(0);
  return initial ? initial.toUpperCase() : '?';
}

function formatRange(startDate: Date, endDate: Date) {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
  }

  if (sameYear) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}

function buildFallbackMetrics(now = new Date()): AdoptionMetrics {
  const endDate = endOfDay(now);
  const startDate = startOfDay(subDays(endDate, 16));
  const sampleDates = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    return new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) * progress);
  });

  return {
    stats: [
      { value: '0', label: 'Beta testers', valueClassName: 'text-slate-950 dark:text-white' },
      {
        value: '0',
        label: 'Active this week',
        valueClassName: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        value: '0',
        label: 'Active today',
        valueClassName: 'text-blue-600 dark:text-blue-400',
      },
    ],
    growthData: sampleDates.map((date) => ({
      label: format(date, 'MMM d'),
      value: 0,
    })),
    axisLabels: [0, 3, 6, 8].map((index) => format(sampleDates[index], 'MMM d')),
    chartRangeLabel: formatRange(startDate, endDate),
    avatars: [],
  };
}

export const getAdoptionMetrics = unstable_cache(
  async (): Promise<AdoptionMetrics> => {
    try {
      const supabase = createAdminClient();
      const now = new Date();

      const [profilesResult, behaviorResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, created_at, last_seen')
          .order('created_at', { ascending: true }),
        supabase.from('user_behavior_snapshot').select('user_id, last_activity_at, last_seen'),
      ]);

      if (profilesResult.error) throw profilesResult.error;
      if (behaviorResult.error) throw behaviorResult.error;

      const profiles = (profilesResult.data ?? []) as ProfileLite[];
      const behaviors = (behaviorResult.data ?? []) as BehaviorSnapshotLite[];
      const behaviorMap = new Map(
        behaviors
          .filter((entry): entry is BehaviorSnapshotLite & { user_id: string } =>
            Boolean(entry.user_id),
          )
          .map((entry) => [entry.user_id, entry]),
      );

      const createdDates = profiles
        .map((profile) => toDate(profile.created_at))
        .filter((date): date is Date => Boolean(date))
        .sort((left, right) => left.getTime() - right.getTime());

      const weekCutoff = subDays(now, 7);
      const todayCutoff = subDays(now, 1);

      const activeTimestamps = profiles
        .map((profile) => {
          const behavior = behaviorMap.get(profile.id);

          return (
            toDate(behavior?.last_activity_at) ??
            toDate(behavior?.last_seen) ??
            toDate(profile.last_seen)
          );
        })
        .filter((date): date is Date => Boolean(date));

      const activeThisWeek = activeTimestamps.filter((date) => date >= weekCutoff).length;
      const activeToday = activeTimestamps.filter((date) => date >= todayCutoff).length;

      const chartEndDate = endOfDay(now);
      const chartStartDate = startOfDay(subDays(chartEndDate, 16));
      const sampleDates = Array.from({ length: 9 }, (_, index) => {
        const progress = index / 8;
        return new Date(
          chartStartDate.getTime() + (chartEndDate.getTime() - chartStartDate.getTime()) * progress,
        );
      });

      let createdIndex = 0;
      const growthData = sampleDates.map((sampleDate) => {
        while (
          createdIndex < createdDates.length &&
          createdDates[createdIndex].getTime() <= sampleDate.getTime()
        ) {
          createdIndex += 1;
        }

        return {
          label: format(sampleDate, 'MMM d'),
          value: createdIndex,
        };
      });

      const avatars: AdoptionAvatar[] = [...profiles]
        .sort((left, right) => {
          const leftBehavior = behaviorMap.get(left.id);
          const rightBehavior = behaviorMap.get(right.id);

          const leftDate =
            toDate(leftBehavior?.last_activity_at) ??
            toDate(leftBehavior?.last_seen) ??
            toDate(left.last_seen) ??
            toDate(left.created_at) ??
            new Date(0);
          const rightDate =
            toDate(rightBehavior?.last_activity_at) ??
            toDate(rightBehavior?.last_seen) ??
            toDate(right.last_seen) ??
            toDate(right.created_at) ??
            new Date(0);

          return rightDate.getTime() - leftDate.getTime();
        })
        .slice(0, 3)
        .map((profile, index) => ({
          label: getInitial(profile),
          className: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
        }));

      const remainingUsers = Math.max(profiles.length - avatars.length, 0);

      if (remainingUsers > 0) {
        avatars.push({
          label: remainingUsers > 99 ? '99+' : `+${remainingUsers}`,
          className: 'bg-[#3b82f6] text-white',
          compact: remainingUsers > 9,
        });
      }

      return {
        stats: [
          {
            value: profiles.length.toLocaleString('en-US'),
            label: 'Beta testers',
            valueClassName: 'text-slate-950 dark:text-white',
          },
          {
            value: activeThisWeek.toLocaleString('en-US'),
            label: 'Active this week',
            valueClassName: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            value: activeToday.toLocaleString('en-US'),
            label: 'Active today',
            valueClassName: 'text-blue-600 dark:text-blue-400',
          },
        ],
        growthData,
        axisLabels: [0, 3, 6, 8].map((index) => growthData[index]?.label ?? ''),
        chartRangeLabel: formatRange(chartStartDate, chartEndDate),
        avatars,
      };
    } catch (error) {
      console.error('Failed to load adoption metrics', error);
      return buildFallbackMetrics();
    }
  },
  ['adoption-metrics'],
  { revalidate: 1800 },
);
