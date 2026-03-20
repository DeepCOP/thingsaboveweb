type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalDocumentLayoutProps = {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
};

export default function LegalDocumentLayout({
  eyebrow,
  title,
  summary,
  updatedAt,
  sections,
}: LegalDocumentLayoutProps) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 dark:text-stone-300">
            {summary}
          </p>
          <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
            Last updated: {updatedAt}
          </p>
        </section>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700 dark:text-stone-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-3 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
