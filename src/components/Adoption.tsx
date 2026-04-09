'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const stats = [
  {
    value: '15',
    label: 'Beta testers',
    valueClassName: 'text-slate-950 dark:text-white',
  },
  {
    value: '11',
    label: 'Active this week',
    valueClassName: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: '5',
    label: 'Active today',
    valueClassName: 'text-blue-600 dark:text-blue-400',
  },
];

const growthData = [
  { label: 'Mar 22', value: 1.1 },
  { label: 'Mar 24', value: 1.8 },
  { label: 'Mar 27', value: 3.6 },
  { label: 'Mar 29', value: 4.4 },
  { label: 'Mar 31', value: 5.3 },
  { label: 'Apr 2', value: 6.1 },
  { label: 'Apr 4', value: 7.0 },
  { label: 'Apr 6', value: 7.8 },
  { label: 'Apr 7', value: 11.3 },
];

const axisLabels = ['Mar 22', 'Mar 29', 'Apr 1', 'Apr 7'];

const avatars = [
  { label: 'J', className: 'bg-[#1aa37a] text-white' },
  { label: 'M', className: 'bg-[#2466b4] text-white' },
  { label: 'S', className: 'bg-[#0f766e] text-white' },
  { label: '+', className: 'bg-[#3b82f6] text-white' },
];

const CHART_WIDTH = 920;
const CHART_HEIGHT = 360;
const CHART_PADDING = { top: 28, right: 34, bottom: 34, left: 22 };
const CHART_BASELINE = CHART_HEIGHT - CHART_PADDING.bottom;
const CHART_MAX = 12;

type Point = {
  x: number;
  y: number;
};

const points = growthData.map((item, index) => {
  const usableWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const usableHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const x = CHART_PADDING.left + (usableWidth * index) / (growthData.length - 1);
  const y = CHART_PADDING.top + usableHeight * (1 - item.value / CHART_MAX);

  return { ...item, x, y };
});

function buildSmoothPath(chartPoints: Point[]) {
  if (chartPoints.length === 0) return '';

  return chartPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previousPoint = chartPoints[index - 1];
    const controlX = (previousPoint.x + point.x) / 2;

    return `${path} C ${controlX} ${previousPoint.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

const linePath = buildSmoothPath(points);
const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_BASELINE} L ${points[0].x} ${CHART_BASELINE} Z`;

export default function Adoption() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const current = sectionRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="adoption"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f9fefd_0%,#eef9f8_45%,#e9f5f4_100%)] py-24 dark:bg-[linear-gradient(180deg,#041311_0%,#071c18_50%,#0a211d_100%)] sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-600/20" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Our first beta testers
            <span className="mt-3 block text-[#1aa37a]">are already reading</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-2xl">
            A small but growing group of early believers helping us shape the future of ThingsAbove,
            one day at a time.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.12 + index * 0.1 }}
              className="rounded-[28px] border border-emerald-200/80 bg-white/90 px-8 py-8 text-center shadow-[0_18px_50px_-30px_rgba(16,185,129,0.35)] backdrop-blur dark:border-emerald-900/70 dark:bg-white/5 dark:shadow-[0_22px_50px_-35px_rgba(16,185,129,0.45)]">
              <div
                className={`text-5xl font-bold tracking-tight sm:text-6xl ${stat.valueClassName}`}>
                {stat.value}
              </div>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 sm:text-[1.65rem] sm:leading-none sm:tracking-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="overflow-hidden rounded-[32px] border border-emerald-200/80 bg-white/90 p-5 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur dark:border-emerald-900/70 dark:bg-white/5 dark:shadow-[0_28px_80px_-45px_rgba(0,0,0,0.7)] sm:p-8">
          <div className="text-lg text-slate-400 dark:text-slate-500 sm:text-[1.15rem]">
            Beta tester growth | Mar - Apr 2026
          </div>

          <div className="mt-6 h-[18rem] sm:h-[25rem]">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="h-full w-full"
              role="img"
              aria-label="Beta tester growth chart from March to April 2026">
              <defs>
                <linearGradient id="adoption-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(26, 163, 122, 0.18)" />
                  <stop offset="100%" stopColor="rgba(26, 163, 122, 0.03)" />
                </linearGradient>
                <linearGradient id="adoption-line-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#179f78" />
                  <stop offset="100%" stopColor="#27b086" />
                </linearGradient>
                <filter id="adoption-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="10"
                    stdDeviation="12"
                    floodColor="#169b78"
                    floodOpacity="0.12"
                  />
                </filter>
              </defs>

              <motion.path
                d={areaPath}
                fill="url(#adoption-area-fill)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.35 }}
              />

              <motion.path
                d={linePath}
                fill="none"
                stroke="url(#adoption-line-stroke)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#adoption-line-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.25, delay: 0.28, ease: 'easeOut' }}
              />

              {points.map((point, index) => (
                <motion.g
                  key={point.label}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.35, delay: 0.45 + index * 0.07 }}>
                  <circle cx={point.x} cy={point.y} r="11" fill="rgba(26, 163, 122, 0.14)" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="7.5"
                    fill="#22a37a"
                    stroke="white"
                    strokeWidth="4"
                  />
                </motion.g>
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-start justify-between gap-4 px-2 text-xl tracking-tight text-slate-400 dark:text-slate-500 sm:text-[1.15rem]">
            {axisLabels.map((label, index) => (
              <div key={label} className={index === 2 ? 'text-center' : ''}>
                {index === 2 ? (
                  <>
                    <span className="block">Apr</span>
                    <span className="block">1</span>
                  </>
                ) : (
                  label
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex -space-x-3">
            {avatars.map((avatar) => (
              <div
                key={avatar.label}
                className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-xl font-semibold shadow-sm dark:border-[#0a211d] ${avatar.className}`}>
                {avatar.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <p className="text-2xl text-slate-600 dark:text-slate-300">
              Want to be part of the beta?
            </p>
            <button
              type="button"
              onClick={() => router.push('/auth/sign-up')}
              className="group inline-flex items-center gap-2 text-2xl font-medium text-[#1aa37a] transition-colors hover:text-[#148463] dark:text-emerald-400 dark:hover:text-emerald-300">
              <span>Join early access</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
