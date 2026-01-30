import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import supabase from './supabaseClient';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
