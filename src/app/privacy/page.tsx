import type { Metadata } from 'next';

import LegalDocumentLayout from '@/src/components/LegalDocumentLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | ThingsAbove',
  description:
    'Read the ThingsAbove Privacy Policy, explaining how we collect, use, and protect your personal information.',
};

const sections = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'When you create an account, we collect your email address and chosen display name. If you provide a profile image, biography, or other optional details, those are also collected and stored as part of your profile.',
      'When you create, submit, or interact with devotional plans, community content, reading progress, and other features, we store that activity in association with your account to provide the service.',
      'We may collect technical information such as your IP address, browser type, device type, operating system, and page interaction data to maintain and improve the service.',
    ],
  },
  {
    title: 'How We Use Your Information',
    paragraphs: [
      'Your account information is used to authenticate you, personalize your experience, display your profile, and enable communication related to the service (such as password resets or account notifications).',
      'Content and usage data are used to operate the platform, display reading plans, track progress, support community features, and improve the app over time.',
      'We do not sell your personal information to any third party. We do not use your data for advertising or marketing unrelated to ThingsAbove.',
    ],
    bullets: [
      'To provide, maintain, and improve the ThingsAbove service.',
      'To enforce our Terms of Service, Statement of Faith, and content standards.',
      'To communicate with you about your account or important service updates.',
      'To protect the security and integrity of the platform and its users.',
    ],
  },
  {
    title: 'Data Sharing and Disclosure',
    paragraphs: [
      'We do not share your personal information with third parties except as necessary to operate the service (e.g., hosting infrastructure, email delivery) or as required by law.',
      'Any third-party service providers we engage are contractually obligated to protect your data and may only use it for the specific services they provide to ThingsAbove.',
      'If ThingsAbove is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction. You will be notified via email and/or a prominent notice on the platform of any change in ownership or data use.',
    ],
  },
  {
    title: 'Data Retention and Deletion',
    paragraphs: [
      'We retain your account information and associated content for as long as your account remains active or as needed to provide the service.',
      'If you delete your account, we will remove or anonymize your personal information and associated content within a reasonable period, except where retention is required by law or for legitimate business purposes such as abuse prevention.',
      'You may request a copy of your data or ask questions about data retention by contacting us at the email address listed below.',
    ],
  },
  {
    title: 'Cookies and Local Storage',
    paragraphs: [
      'We use essential cookies and local storage to authenticate sessions, remember your preferences (such as theme selection), and maintain a secure browsing experience.',
      'We do not use third-party tracking cookies, advertising cookies, or analytics services that share data with advertising networks.',
      'You can configure your browser to reject cookies, but some features of the service may not function properly as a result.',
    ],
  },
  {
    title: 'Children and Minors',
    paragraphs: [
      'ThingsAbove is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.',
      'If we become aware that a child under 13 has provided us with personal information, we will take steps to delete that information as soon as reasonably possible.',
    ],
  },
  {
    title: 'Security',
    paragraphs: [
      'We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption in transit, secure authentication practices, and regular security reviews.',
      'No method of electronic storage or transmission is completely secure. While we strive to protect your data, we cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. If material changes are made, we will notify you by email and/or a prominent notice on the platform before the changes take effect.',
      'Your continued use of ThingsAfter after updated Privacy Policy becomes effective constitutes acceptance of the revised policy.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      'If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, you may contact us at:',
    ],
    bullets: [
      'Email: privacy@thingsabove.life',
      'ThingsAbove c/o Deep COP Studios',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout
      eyebrow="ThingsAbove Legal"
      title="Privacy Policy"
      summary="This Privacy Policy explains how ThingsAbove collects, uses, and protects your personal information. We do not sell your data, and we are committed to keeping your information safe."
      updatedAt="March 19, 2026"
      sections={sections}
    />
  );
}