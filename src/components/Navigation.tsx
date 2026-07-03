'use client';

import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, BookOpen, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/state/AuthContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isGuest, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  const navigateToSection = (id: string) => {
    // If we're already on the homepage, smooth scroll.
    if (pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Otherwise, navigate to the homepage with the section hash.
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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}>
            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-semibold text-neutral-900 dark:text-white">
              ThingsAbove
            </span>
          </div>

          <div className="hidden nav:flex items-center space-x-5 justify-center lg:space-x-8">
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
            <button
              onClick={() => navigateToSection('download')}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Download
            </button>
          </div>

          <div className="hidden nav:flex items-center space-x-4">
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
              <>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
                  Login
                </button>
                <button
                  onClick={() => router.push('/auth/sign-up')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Get Started
                </button>
              </>
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

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="nav:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-navigation-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="nav:hidden absolute top-16 left-4 right-4 origin-top rounded-xl border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('features');
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('how-it-works');
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  How It Works
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('community');
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  Community
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('download');
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  Download
                </button>

                <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />

                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center gap-3 px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
                </button>

                {isGuest ? (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/auth/login');
                      }}
                      className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/auth/sign-up');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Get Started
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/plans/my');
                      }}
                      className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      My Plans
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/plans/new');
                      }}
                      className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setIsMenuOpen(false);
                        await signOut();
                        router.replace('/');
                      }}
                      className="px-3 py-2.5 text-left text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      Log out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
