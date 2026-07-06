import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-stone-50 px-4 py-20 dark:bg-stone-900 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center blur-3xl">
        <div className="h-72 w-72 rounded-full bg-emerald-300/25 dark:bg-emerald-500/10" />
      </div>

      <section className="mx-auto max-w-xl text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
          404
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          This page wandered off the path.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
          The page you’re looking for doesn’t exist or may have moved. You can head home or keep
          growing with ThingsAbove in the app.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto">
            <Link href="/download">
              <Download aria-hidden="true" />
              Download the app
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
