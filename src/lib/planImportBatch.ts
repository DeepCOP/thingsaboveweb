import type { DevotionalDayInput, DevotionalPlanInsert } from '../types/types';

export type PlanImportTask = {
  id: string;
  label: string;
  title: string;
  description: string;
  coverImage?: string;
  visibility: 'public' | 'private';
  tags: string[];
  days: DevotionalDayInput[];
  created: boolean;
  status: 'pending' | 'creating' | 'saving' | 'saved' | 'failed';
  error?: string;
};

type Options = {
  authorId: string;
};

type Mutations = {
  createPlan: (payload: DevotionalPlanInsert) => Promise<unknown>;
  saveDraft: (days: DevotionalDayInput[], planId: string) => Promise<unknown>;
};

/** Keep each plan's identity and completed steps so a partial batch can be retried. */
export async function runPlanImportBatch(
  tasks: PlanImportTask[],
  options: Options,
  mutations: Mutations,
  onProgress: (tasks: PlanImportTask[]) => void,
): Promise<PlanImportTask[]> {
  if (!options.authorId || !tasks.length) throw new Error('Sign in and choose plans to import.');
  for (const task of tasks) {
    if (
      !task.title.trim() ||
      task.title.length > 120 ||
      !task.description.trim() ||
      task.description.length > 500 ||
      task.days.length < 1 ||
      task.days.length > 365
    ) {
      throw new Error('Every plan needs a title, a description, and between 1 and 365 days.');
    }
  }

  let results = tasks.map((task) => ({ ...task }));
  const update = (index: number, changes: Partial<PlanImportTask>) => {
    results = results.map((task, i) => (i === index ? { ...task, ...changes } : task));
    onProgress(results);
  };

  for (let index = 0; index < results.length; index++) {
    if (results[index].status === 'saved') continue;
    try {
      if (!results[index].created) {
        update(index, { status: 'creating', error: undefined });
        const task = results[index];
        await mutations.createPlan({
          id: task.id,
          author_id: options.authorId,
          title: task.title.trim(),
          description: task.description.trim(),
          cover_image: task.coverImage,
          tags: task.tags.length ? task.tags : null,
          total_days: task.days.length,
          visibility: task.visibility,
        });
        update(index, { created: true });
      }
      update(index, { status: 'saving', error: undefined });
      await mutations.saveDraft(results[index].days, results[index].id);
      update(index, { status: 'saved' });
    } catch (error) {
      const detail =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Please try again.';
      update(index, {
        status: 'failed',
        error: `${results[index].created ? 'Plan created, but days were not saved.' : 'Could not create this plan.'} ${detail}`,
      });
    }
  }
  return results;
}
