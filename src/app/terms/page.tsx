import type { Metadata } from 'next';

import LegalDocumentLayout from '@/src/components/LegalDocumentLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | ThingsAbove',
  description:
    'Read the Terms of Service for ThingsAbove, including content standards tied to historical Christian principles.',
};

const sections = [
  {
    title: 'Acceptance of These Terms',
    paragraphs: [
      'These Terms of Service govern your use of ThingsAbove, including account creation, devotional plans, submitted content, and community features.',
      'By accessing the service, creating an account, or publishing content, you agree to these Terms and to the ThingsAbove Statement of Faith.',
    ],
  },
  {
    title: 'Accounts and Eligibility',
    paragraphs: [
      'You must provide accurate account information, maintain the security of your credentials, and use the service in good faith.',
      'You are responsible for activity that occurs under your account. If you believe your account has been compromised, you must take reasonable steps to secure it immediately.',
    ],
  },
  {
    title: 'User Content and License',
    paragraphs: [
      'You retain ownership of the content you create and submit to ThingsAbove. By submitting content, you grant ThingsAbove a non-exclusive, worldwide license to host, store, reproduce, display, and distribute that content for the purpose of operating and improving the service.',
      'You are solely responsible for your submitted content, including devotional teaching, scripture references, titles, descriptions, images, and any related material.',
    ],
  },
  {
    title: 'Historical Christian Principles and Content Standards',
    paragraphs: [
      'ThingsAbove is a Christian platform built around historical Christian principles and the theological baseline described in our Statement of Faith. All submitted content must respect that foundation.',
      'This standard is strictly enforced. Content that materially contradicts, mocks, or undermines historical Christian principles may be rejected or removed at our discretion.',
    ],
    bullets: [
      'Submitted content may not materially conflict with the ThingsAbove Statement of Faith or historic Christian orthodoxy.',
      'Submitted content may not be blasphemous, hateful, sexually explicit, exploitative or deceptive.',
      'Submitted content may not use scripture, prayer, or Christian teaching as a pretext for manipulation, harassment, or abuse.',
      'You may not upload content you do not have the right to use.',
    ],
  },
  {
    title: 'Moderation and Enforcement',
    paragraphs: [
      'ThingsAbove may review, refuse, edit, unpublish, suspend, or remove content that violates these Terms, the Statement of Faith, or the safety of the community.',
      'We may suspend or terminate accounts for repeated violations or for a single serious violation. We may act with or without prior notice when reasonably necessary to protect the platform or its users.',
    ],
  },
  {
    title: 'Service Availability and Changes',
    paragraphs: [
      'We may update, improve, pause, or discontinue portions of the service at any time. We do not guarantee uninterrupted availability or that every feature will remain unchanged.',
      'We may revise these Terms from time to time. Continued use of the service after updated Terms become effective constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: 'Disclaimers and Limitation of Liability',
    paragraphs: [
      'ThingsAbove is provided on an as available and as is basis to the fullest extent permitted by law. We make no guarantee that the service will always be error free, secure, or suitable for every ministry or devotional use case.',
      'To the fullest extent permitted by law, ThingsAbove and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the service.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      eyebrow="ThingsAbove Legal"
      title="Terms of Service"
      summary="These terms define the rules for using ThingsAbove. They also set the platform's content standard: submitted material must not violate historical Christian principles, and that standard is strictly enforced."
      updatedAt="March 19, 2026"
      sections={sections}
    />
  );
}
