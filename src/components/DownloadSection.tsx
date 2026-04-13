import { ArrowUpRight, Download, FlaskConical, Smartphone } from 'lucide-react';

const iosBetaUrl = process.env.NEXT_PUBLIC_IOS_TESTFLIGHT_URL;
const androidBetaUrl = process.env.NEXT_PUBLIC_ANDROID_BETA_URL;

const downloadOptions = [
  {
    title: 'iPhone & iPad',
    channel: 'TestFlight beta',
    description: 'Get the latest approved iOS beta',
    href: iosBetaUrl,
    cta: 'Join on TestFlight',
    icon: Smartphone,
    accent: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
  },
  {
    title: 'Android',
    channel: 'GitHub beta',
    description: 'Install the latest Android beta from GitHub Releases',
    href: androidBetaUrl,
    cta: 'Download Android beta',
    icon: Download,
    accent: 'bg-amber-500/12 text-amber-700 dark:text-amber-200',
  },
];

export default function DownloadSection() {
  return (
    <section
      id="download"
      className="border-y border-stone-200/80 bg-stone-50 py-24 dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-stone-950 dark:text-emerald-200">
            <FlaskConical className="h-4 w-4" />
            <span>Mobile beta</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
              Download the latest beta
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
              Take Things Above with you each day. Join the iOS beta through TestFlight or grab the
              latest Android beta build.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {downloadOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.title}
                className="flex h-full flex-col justify-between rounded-lg border border-stone-200 bg-white p-7 shadow-sm shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-950 dark:shadow-none">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${option.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                          {option.channel}
                        </p>
                        <h3 className="text-2xl font-semibold text-stone-950 dark:text-white">
                          {option.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed text-stone-600 dark:text-stone-300">
                    {option.description}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {option.href ? (
                    <a
                      href={option.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-emerald-500 dark:text-stone-950 dark:hover:bg-emerald-400">
                      <span>{option.cta}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center rounded-lg border border-dashed border-stone-300 px-5 py-3 text-sm font-semibold text-stone-500 dark:border-stone-700 dark:text-stone-400">
                      Link coming soon
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
