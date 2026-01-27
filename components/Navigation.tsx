'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/state/AuthContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { session, isGuest, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (id: string) => {
    // If we're already on the homepage → smooth scroll
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Otherwise → navigate to homepage with hash
    router.push(`/#${id}`);
  };

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}>
            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-semibold text-neutral-900 dark:text-white">
              ThingsAbove
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigateToSection('features')}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Features
            </button>
            <button
              onClick={() => navigateToSection('how-it-works')}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              How It Works
            </button>
            <button
              onClick={() => navigateToSection('community')}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Community
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              )}
            </button>
            {isGuest && (
              <button
                onClick={() => router.push('/auth/sign-up')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                Get Started
              </button>
            )}
            {!isGuest && (
              <>
                <button
                  onClick={() => router.push('/plans/my')}
                  className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  My Plans
                </button>
                <button
                  onClick={() => router.push('/plans/new')}
                  className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  Create
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    router.replace('/');
                  }}
                  className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
