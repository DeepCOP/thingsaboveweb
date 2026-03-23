'use client';

import { BookOpen, Github, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                ThingsAbove
              </span>
            </div>
            <p className="mb-4 max-w-md text-neutral-600 dark:text-neutral-400">
              Grow your faith one day at a time with daily devotionals, reading plans, and a
              supportive community.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
                aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
                aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
                aria-label="Github">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Reading Plans
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
              Beliefs & Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/statement-of-faith"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Statement of Faith
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/sign-up"
                  className="text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              (c) {new Date().getFullYear()} ThingsAbove. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="mt-4 text-sm text-emerald-600 hover:underline dark:text-emerald-400 md:mt-0">
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
