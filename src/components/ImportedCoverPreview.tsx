'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImportedCoverPreview({ src }: { src: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {failedUrl === src ? (
        <p className="text-sm text-amber-800 dark:text-amber-300">
          This cover could not be previewed. Check that the URL points to a publicly accessible
          image.
        </p>
      ) : (
        <Image
          src={src}
          alt="Imported plan cover"
          width={320}
          height={180}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(src)}
          className="h-36 w-64 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700"
        />
      )}
      <p className="break-all text-xs text-neutral-500 dark:text-neutral-400">{src}</p>
    </div>
  );
}
