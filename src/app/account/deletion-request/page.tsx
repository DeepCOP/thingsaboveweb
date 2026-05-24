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
import { Checkbox } from '@/src/components/ui/checkbox';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

const DELETION_EMAIL = 'godwinwoo@gmail.com';

const deletionOptions = [
  {
    id: 'full-deletion',
    label: 'Full Account Deletion',
    description: 'Delete my account and all associated data permanently.',
  },
  {
    id: 'content-only',
    label: 'Delete Content Only',
    description:
      'Remove my devotional plans, comments, and community content, but keep my account.',
  },
  {
    id: 'profile-only',
    label: 'Delete Profile Data Only',
    description:
      'Remove my profile image, biography, and personal details, but keep my account and content.',
  },
  {
    id: 'partial-content',
    label: 'Partial Content Deletion',
    description: 'Remove specific content I will describe below.',
  },
] as const;

export default function DeletionRequestPage() {
  const [email, setEmail] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [name, setName] = useState('');

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const buildMailBody = () => {
    const lines: string[] = [];

    lines.push('Account Deletion / Data Removal Request');
    lines.push('========================================');
    lines.push('');
    lines.push(`Name: ${name || '(not provided)'}`);
    lines.push(`Email: ${email}`);
    lines.push('');
    lines.push('Requested Actions:');
    lines.push('-----------------');

    for (const optionId of selectedOptions) {
      const option = deletionOptions.find((o) => o.id === optionId);
      if (option) {
        lines.push(`- ${option.label}: ${option.description}`);
      }
    }

    if (selectedOptions.length === 0) {
      lines.push('(none selected)');
    }

    if (additionalDetails.trim()) {
      lines.push('');
      lines.push('Additional Details:');
      lines.push('-------------------');
      lines.push(additionalDetails.trim());
    }

    lines.push('');
    lines.push('---');
    lines.push('Sent from ThingsAbove Account Deletion Request page');

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Account Deletion Request - ${email}`);
    const body = encodeURIComponent(buildMailBody());
    window.location.href = `mailto:${DELETION_EMAIL}?subject=${subject}&body=${body}`;
  };

  const canSubmit = email.trim().length > 0 && selectedOptions.length > 0;

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
            <Mail className="h-4 w-4" />
            ThingsAbove Privacy
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Request Account Deletion
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Use this form to request full or partial deletion of your account and data. Submitting
            this form will open your email client with a pre-composed message to our privacy team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>
                Provide your details so we can identify your account and follow up with you.
              </CardDescription>
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
                  Account Email <span className="text-red-500">*</span>
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

          {/* Deletion Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Would You Like to Do?</CardTitle>
              <CardDescription>
                Select all that apply. You can also describe specific requests in the details
                section below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deletionOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    selectedOptions.includes(option.id)
                      ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/30'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700'
                  }`}>
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => toggleOption(option.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Details</CardTitle>
              <CardDescription>
                If you selected &ldquo;Partial Content Deletion&rdquo; or have specific
                instructions, describe them here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Describe any specific content you want removed or any additional context for your request..."
                className="flex min-h-[120px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-400"
                value={additionalDetails}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAdditionalDetails(e.target.value)
                }
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Open Email Client to Send Request
            </Button>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              This will open your default email client with the request pre-composed. Nothing is
              sent until you hit send.
            </p>
          </div>
        </form>

        {/* Privacy note */}
        <Card className="mt-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-700 dark:text-amber-400">
            <ul className="list-inside list-disc space-y-1">
              <li>Our privacy team will review your request and respond within 7 business days.</li>
              <li>We may ask for additional verification before processing your request.</li>
              <li>
                Full account deletion is irreversible. You will lose access to all plans, progress,
                and community content.
              </li>
              <li>
                Some data may be retained if required by law or for legitimate business purposes
                (e.g., abuse prevention).
              </li>
            </ul>
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
