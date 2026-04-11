export default function AdoptionSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f9fefd_0%,#eef9f8_45%,#e9f5f4_100%)] py-24 dark:bg-[linear-gradient(180deg,#041311_0%,#071c18_50%,#0a211d_100%)] sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-600/20" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl animate-pulse flex-col items-center text-center">
          <div className="h-8 w-64 rounded-full bg-emerald-100 dark:bg-emerald-900/40 sm:h-10 sm:w-80" />
          <div className="mt-4 h-8 w-72 rounded-full bg-emerald-200 dark:bg-emerald-800/50 sm:h-10 sm:w-96" />
          <div className="mt-7 h-4 w-full max-w-3xl rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div
              key={card}
              className="rounded-[28px] border border-emerald-200/80 bg-white/90 px-8 py-8 text-center shadow-[0_18px_50px_-30px_rgba(16,185,129,0.35)] backdrop-blur dark:border-emerald-900/70 dark:bg-white/5">
              <div className="flex animate-pulse flex-col items-center">
                <div className="h-12 w-20 rounded-full bg-slate-200 dark:bg-slate-800 sm:h-14 sm:w-24" />
                <div className="mt-5 h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-800 sm:w-36" />
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[32px] border border-emerald-200/80 bg-white/90 p-5 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.18)] backdrop-blur dark:border-emerald-900/70 dark:bg-white/5 sm:p-8">
          <div className="h-5 w-52 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 sm:w-64" />

          <div className="mt-6 h-[18rem] rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(226,242,239,0.8)_100%)] p-6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(16,35,31,0.6)_100%)] sm:h-[25rem]">
            <div className="relative h-full animate-pulse overflow-hidden rounded-[24px] border border-emerald-100/80 bg-white/40 dark:border-emerald-950/40 dark:bg-white/[0.02]">
              <div className="absolute bottom-14 left-8 right-8 h-40 rounded-[40px] bg-emerald-100/80 dark:bg-emerald-950/30" />
              <div className="absolute bottom-24 left-8 right-8 h-1 rounded-full bg-emerald-300/90 dark:bg-emerald-700/70" />
              {[0, 1, 2, 3, 4, 5].map((dot) => (
                <div
                  key={dot}
                  className="absolute h-4 w-4 rounded-full border-4 border-white bg-emerald-400 shadow-sm dark:border-[#0a211d]"
                  style={{
                    left: `${12 + dot * 14}%`,
                    bottom: `${14 + dot * 6}%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 flex justify-between gap-4 px-2">
            {[0, 1, 2, 3].map((label) => (
              <div
                key={label}
                className="h-4 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 sm:w-16"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex -space-x-3">
            {[0, 1, 2, 3].map((avatar) => (
              <div
                key={avatar}
                className="h-14 w-14 animate-pulse rounded-full border-4 border-white bg-slate-200 shadow-sm dark:border-[#0a211d] dark:bg-slate-800"
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="h-5 w-56 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 sm:h-6 sm:w-72" />
            <div className="h-5 w-36 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-800/50 sm:h-6 sm:w-44" />
          </div>
        </div>
      </div>
    </section>
  );
}
