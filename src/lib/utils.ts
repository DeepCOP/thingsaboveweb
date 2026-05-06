import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import supabase from './supabaseClient';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_PLAN_COVER_IMAGE_MB = 5;
export const MAX_PLAN_COVER_IMAGE_BYTES = MAX_PLAN_COVER_IMAGE_MB * 1024 * 1024;

export function isPlanCoverImageTooLarge(file: File) {
  return file.size > MAX_PLAN_COVER_IMAGE_BYTES;
}

// This check can be removed, it is just for tutorial purposes

export async function uploadPlanCover({
  file,
  userId,
  planId,
}: {
  file: File;
  userId: string;
  planId: string;
}) {
  if (isPlanCoverImageTooLarge(file)) {
    alert(`Cover image must be ${MAX_PLAN_COVER_IMAGE_MB} MB or smaller.`);
    return;
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from('plan_images').upload(filePath, file, {
    upsert: true,
  });

  if (uploadError) {
    console.error(uploadError);
    alert('Failed to upload cover image');
    return;
  }

  const { data } = supabase.storage.from('plan_images').getPublicUrl(filePath);

  return data.publicUrl;
}
