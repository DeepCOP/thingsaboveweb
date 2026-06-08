import { Apple, ArrowUpRight, Download, FlaskConical, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { isBetaSite } from '@/src/lib/site-channel';

const iosDownloadUrl = process.env.NEXT_PUBLIC_IOS_DOWNLOAD_URL;
const androidDownloadUrl = process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL;

type StoreBadge = {
  src: string;
  alt: string;
};

type DownloadOption = {
  title: string;
  channel: string;
  description: string;
  href: string | undefined;
  cta: string;
  icon: LucideIcon;
  accent: string;
  storeBadge?: StoreBadge;
};

type DownloadContent = {
  badge: string;
  BadgeIcon: LucideIcon;
  title: string;
  description: string;
  options: DownloadOption[];
};

const storeBadgeClassName =
  'inline-flex w-full max-w-[15rem] transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950';

const downloadContent: DownloadContent = isBetaSite
  ? {
      badge: 'Mobile beta',
      BadgeIcon: FlaskConical,
      title: 'Download the latest beta',
      description:
        'Take Things Above with you each day. Join the iOS beta through TestFlight or Android testing through Google Play.',
      options: [
        {
          title: 'iPhone & iPad',
          channel: 'TestFlight beta',
          description: 'Get the latest approved iOS beta',
          href: iosDownloadUrl,
          cta: 'Join on TestFlight',
          icon: Smartphone,
          accent: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
        },
        {
          title: 'Android',
          channel: 'Google Play testing',
          description: 'Join the Android testing track on Google Play',
          href: androidDownloadUrl,
          cta: 'Join Android testing',
          icon: Download,
          accent: 'bg-amber-500/12 text-amber-700 dark:text-amber-200',
        },
      ],
    }
  : {
      badge: 'Mobile app',
      BadgeIcon: Download,
      title: 'Download Things Above',
      description: 'Take Things Above with you each day on iPhone, iPad, or Android.',
      options: [
        {
          title: 'iPhone & iPad',
          channel: 'App Store',
          description: 'Download Things Above from the App Store',
          href: iosDownloadUrl,
          cta: 'Download on the App Store',
          icon: Apple,
          accent: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
          storeBadge: {
            src: '/assets/icons/Download_on_the_App_Store_Badge.svg.png',
            alt: 'Download on the App Store',
          },
        },
        {
          title: 'Android',
          channel: 'Google Play',
          description: 'Get Things Above for Android on Google Play',
          href: androidDownloadUrl,
          cta: 'Get it on Google Play',
          icon: Download,
          accent: 'bg-blue-500/12 text-blue-700 dark:text-blue-200',
          storeBadge: {
            src: '/assets/icons/Google_Play_Store_badge_EN.svg.png',
            alt: 'Get it on Google Play',
          },
        },
      ],
    };

function StoreBadgeImage({ badge }: { badge: StoreBadge }) {
  return (
    <Image src={badge.src} alt={badge.alt} width={3840} height={1138} className="h-auto w-full" />
  );
}

export default function DownloadSection() {
  const BadgeIcon = downloadContent.BadgeIcon;

  return (
    <section
      id="download"
      className="border-y border-stone-200/80 bg-stone-50 py-24 dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-stone-950 dark:text-emerald-200">
            <BadgeIcon className="h-4 w-4" />
            <span>{downloadContent.badge}</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
              {downloadContent.title}
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
              {downloadContent.description}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {downloadContent.options.map((option) => {
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
                  {option.storeBadge ? (
                    option.href ? (
                      <a
                        href={option.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={option.cta}
                        className={`${storeBadgeClassName} hover:opacity-90`}>
                        <StoreBadgeImage badge={option.storeBadge} />
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        title="Link coming soon"
                        className={`${storeBadgeClassName} cursor-not-allowed opacity-60`}>
                        <StoreBadgeImage badge={option.storeBadge} />
                      </span>
                    )
                  ) : option.href ? (
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
