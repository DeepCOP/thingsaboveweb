'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CTA() {
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

    const element = document.getElementById('cta');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta"
      className="py-24 bg-gradient-to-br from-emerald-600 to-blue-600 dark:from-emerald-700 dark:to-blue-700 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Start your journey today</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Begin Your Daily
            <br />
            Bible Reading Journey
          </h2>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-50 leading-relaxed">
            Join thousands of believers growing in faith through consistent,
            community-driven Bible reading. Start your free plan today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white hover:bg-neutral-50 text-emerald-600 text-lg font-semibold rounded-xl shadow-2xl transition-all flex items-center space-x-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <p className="text-sm text-emerald-100">
            No credit card required • Free forever • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
