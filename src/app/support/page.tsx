'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Mail, ArrowLeft, Send, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const SUPPORT_EMAIL = 'info@thingsabove.life';

const supportCategories = [
  { value: 'general', label: 'General Question' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'prayer', label: 'Prayer Request' },
  { value: 'other', label: 'Other' },
] as const;

const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      'Go to the login page and click "Forgot Password." Enter your email address, and we will send you a link to reset your password. If you do not receive the email within a few minutes, check your spam folder.',
  },
  {
    question: 'How do I delete my account?',
    answer:
      'You can request account deletion by visiting our Account Deletion Request page. We will process your request within 7 business days.',
    link: { text: 'Request Account Deletion', href: '/account/deletion-request' },
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes. You can request a copy of your data by contacting us through this support form. Please select "Other" as the category and specify that you would like a data export. We will respond within 7 business days.',
  },
  {
    question: 'How do I report inappropriate content?',
    answer:
      'If you see content that violates our Terms of Service or Statement of Faith, please report it using this support form. Select "Bug Report" or "Other" and include a link to the content and a brief description of the issue.',
  },
  {
    question: 'Is ThingsAbove free to use?',
    answer:
      'Yes, ThingsAbove is completely free to use. There are no subscription fees, and we do not sell your personal information. We are committed to keeping the platform accessible to everyone.',
  },
  {
    question: 'How do I submit a prayer request?',
    answer:
      'You can submit a prayer request by selecting "Prayer Request" from the category dropdown below and composing your message. Your prayer request will be sent to our team, and we would be honored to pray for you.',
  },
];

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const buildMailBody = () => {
    const lines: string[] = [];

    lines.push('ThingsAbove Support Request');
    lines.push('===========================');
    lines.push('');
    lines.push(`Name: ${name || '(not provided)'}`);
    lines.push(`Email: ${email}`);
    lines.push(
      `Category: ${category ? supportCategories.find((c) => c.value === category)?.label : '(not selected)'}`,
    );
    lines.push('');
    lines.push('Message:');
    lines.push('--------');
    lines.push(message.trim() || '(no message provided)');
    lines.push('');
    lines.push('---');
    lines.push('Sent from ThingsAbove Support page');

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Support Request - ${category ? supportCategories.find((c) => c.value === category)?.label : 'General'} - ${email}`,
    );
    const body = encodeURIComponent(buildMailBody());
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const canSubmit = email.trim().length > 0 && message.trim().length > 0;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-neutral-600 transition-colors hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <HelpCircle className="h-4 w-4" />
            ThingsAbove Support
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            How Can We Help You?
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Have a question, need help with something, or just want to reach out? Fill out the form
            below and we will get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Contact Information</CardTitle>
              <CardDescription>Provide your details so we can follow up with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Can We Help You With?</CardTitle>
              <CardDescription>
                Select a category and describe your question or request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400">
                  <option value="">Select a category...</option>
                  {supportCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">
                  Your Message <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="message"
                  placeholder="Describe your question, issue, or request in detail..."
                  required
                  className="flex min-h-[160px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Open Email Client to Send
            </Button>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              This will open your default email client with your message pre-composed. Nothing is
              sent until you hit send.
            </p>
          </div>
        </form>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <span className="pr-4 font-medium text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <CardContent className="border-t border-neutral-200 pb-6 pt-4 dark:border-neutral-800">
                    <p className="text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                      {faq.answer}
                    </p>
                    {faq.link && (
                      <Link
                        href={faq.link.href}
                        className="mt-3 inline-block text-sm font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300">
                        {faq.link.text} &rarr;
                      </Link>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <Card className="mt-16 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-800 dark:text-emerald-300">
              Additional Resources
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-400">
              You may also find answers in these pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900">
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900">
                Terms of Service
              </Link>
              <Link
                href="/statement-of-faith"
                className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900">
                Statement of Faith
              </Link>
              <Link
                href="/account/deletion-request"
                className="inline-flex items-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900">
                Delete My Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer links */}
        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-500">
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400">
            Privacy Policy
          </Link>
          {' \u00B7 '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
