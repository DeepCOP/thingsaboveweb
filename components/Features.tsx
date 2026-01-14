'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, Users, MessageCircle, Bot} from 'lucide-react';
import { useEffect, useState } from 'react';

const features = [

  {
    icon: BookOpen,
    title: 'Daily Devotional Plans',
    description:
      'Choose from curated reading plans designed to deepen your understanding and strengthen your faith through consistent daily study.',
  },
  {
    icon: Calendar,
    title: 'Track Your Reading Progress',
    description:
      'Monitor your spiritual journey with visual progress tracking, reading streaks, and completion milestones that keep you motivated.',
  },
        {
    icon: Bot,
    title: 'AI Assistant for Deeper Insights',
    description:
      'Get instant explanations, historical context, and thematic connections for any verse or passage with our integrated AI assistant.',
      span: 2,
  },
  {
    icon: Users,
    title: 'Read Together With Friends',
    description:
      'Create or join reading groups, share insights, and encourage one another as you grow in faith together.',
  },
  {
    icon: MessageCircle,
    title: 'Comment & Reflect Each Day',
    description:
      'Record personal reflections, share thoughts with your group, and engage in meaningful discussions about daily readings.',
  },

];

export default function Features() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('features');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Everything You Need to
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Grow in Faith
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-300">
            Powerful features designed to make daily Bible reading engaging,
            consistent, and community-driven.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-neutral-200  dark:border-neutral-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 ${feature.span === 2 ? 'md:col-span-2 md:max-w-xl md:mx-auto' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
