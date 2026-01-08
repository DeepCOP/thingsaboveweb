'use client';

import { motion } from 'framer-motion';
import { Heart, Users, MessageSquare, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Community() {
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

    const element = document.getElementById('community');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="community" className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Faith is Better
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Together
              </span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
              Join reading groups, share insights, and support one another on
              your faith journey. Our community features help you stay
              accountable and inspired through shared experiences and meaningful
              conversations.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Reading Groups
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Create or join groups to read together and stay motivated.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Daily Discussions
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Share reflections and engage in thoughtful conversations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    Encouragement
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Lift each other up with prayers and words of support.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-3xl p-8 shadow-2xl">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-2xl" />

              <div className="relative space-y-4">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-white dark:border-neutral-800"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Morning Prayer Group
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        24 members
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    This passage reminds me to trust in Gods timing, even when
                    things feel uncertain...
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <button className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                      <Heart className="h-4 w-4" />
                      <span>12</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>5</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Group Progress
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-300">
                        Completed readings
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        89%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full w-[89%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
