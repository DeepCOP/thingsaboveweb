'use client';

import { motion } from 'framer-motion';
import { BookMarked, BookOpenCheck, TrendingUp, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  {
    icon: BookMarked,
    title: 'Choose a Plan',
    description:
      'Browse our library of reading plans, from 30-day devotionals to complete Bible reading journeys.',
  },
  {
    icon: BookOpenCheck,
    title: 'Read Daily',
    description:
      'Receive daily notifications and dive into carefully selected passages with guided reflections.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description:
      'Watch your reading streak grow and celebrate milestones as you stay consistent in your journey.',
  },
  {
    icon: UserPlus,
    title: 'Invite Friends',
    description:
      'Share plans with friends, discuss insights, and encourage each other along the way.',
  },
];

export default function HowItWorks() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById('how-it-works');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Simple Steps to
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Start Your Journey
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-300">
            Get started in minutes and build a lasting habit of daily Bible reading.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-emerald-200 dark:from-emerald-900 dark:via-blue-900 dark:to-emerald-900 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg flex items-center justify-center border-2 border-emerald-200 dark:border-emerald-800">
                      <step.icon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
