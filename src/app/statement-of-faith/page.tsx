import type { Metadata } from 'next';

import LegalDocumentLayout from '@/src/components/LegalDocumentLayout';

export const metadata: Metadata = {
  title: 'Statement of Faith | ThingsAbove',
  description:
    'Read the ThingsAbove Statement of Faith, which defines the theological baseline for content on the platform.',
};

const sections = [
  {
    title: 'The Holy Scriptures',
    paragraphs: [
      'We believe that the Old and New Testaments alone are the inspired and authoritative written Word of God for Christian faith, doctrine, and life.',
      'We believe scripture is trustworthy, sufficient, and uniquely authoritative for teaching, correction, and discipleship.',
    ],
  },
  {
    title: 'The Triune God',
    paragraphs: [
      'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.',
      'We believe God is holy, sovereign, just, loving, and worthy of all worship and obedience.',
    ],
  },
  {
    title: 'Jesus Christ',
    paragraphs: [
      'We believe Jesus Christ is fully God and fully man, conceived by the Holy Spirit, born of the virgin Mary, and without sin.',
      'We believe Jesus died as the atoning sacrifice for sin, rose bodily from the dead, ascended to the Father, and will return in glory.',
    ],
  },
  {
    title: 'The Holy Spirit',
    paragraphs: [
      'We believe the Holy Spirit convicts the world of sin, regenerates believers, and indwells, sanctifies, equips, and comforts the people of God.',
      "We believe spiritual growth is the work of the Holy Spirit through scripture, prayer, obedience, and life within Christ's church.",
    ],
  },
  {
    title: 'Humanity, Sin, and Salvation',
    paragraphs: [
      'We believe humanity was created in the image of God with inherent dignity and purpose, yet all people are fallen and in need of redemption because of sin.',
      'We believe salvation is by grace alone through faith alone in Jesus Christ alone, not by personal merit or religious performance.',
    ],
  },
  {
    title: 'The Church and Christian Life',
    paragraphs: [
      'We believe the universal church is the body of Christ, expressed through local congregations committed to worship, discipleship, fellowship, prayer, evangelism, and service.',
      'We believe Christians are called to holiness, truthfulness, humility, compassion, and love of God and neighbor.',
    ],
  },
  {
    title: 'Resurrection and Eternal Hope',
    paragraphs: [
      'We believe in the bodily resurrection of the saved and the lost, the final judgment, everlasting life with God for those who belong to Christ, and final separation from God for those who reject Him.',
      'We believe the Christian life is lived in hope of the return of Christ and the renewal of all things.',
    ],
  },
  {
    title: 'Content Alignment and Enforcement',
    paragraphs: [
      'This Statement of Faith defines the theological baseline for content published on ThingsAbove. We expect plans, devotionals, and community submissions to remain consistent with historical Christian principles.',
      'Content that materially rejects or undermines this foundation may be rejected, unpublished, or removed. Repeated or serious violations may result in account action. This standard is strictly enforced.',
    ],
  },
];

export default function StatementOfFaithPage() {
  return (
    <LegalDocumentLayout
      eyebrow="ThingsAbove Beliefs"
      title="Statement of Faith"
      summary="This statement explains the core Christian convictions that shape ThingsAbove. It also provides the doctrinal baseline used when evaluating submitted content on the platform."
      updatedAt="March 19, 2026"
      sections={sections}
    />
  );
}
