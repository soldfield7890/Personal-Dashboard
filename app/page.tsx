import React from "react";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-800/60 bg-neutral-950/70 p-4 shadow-md backdrop-blur">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          {title}
        </h2>
      </header>
      <div className="text-sm text-neutral-100">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-neutral-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-800/70 bg-black/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Personal Command Center
            </span>
            <span className="text-lg font-semibold">
              Good afternoon, Stephen
            </span>
          </div>
          <div className="hidden items-center gap-4 text-xs text-neutral-400 sm:flex">
            <div className="flex flex-col text-right">
              <span>Today • {today}</span>
              <span className="text-neutral-500">
                3 meetings · 7 tasks · 41°F (sample)
              </span>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-xs">
              SO
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
        {/* Quick status row */}
        <section className="grid gap-3 sm:grid-cols-3">
          <Card title="Focus">
            <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
              <li>Finish MART performance review draft</li>
              <li>Update Common Ground Grow Co. roadmap notes</li>
              <li>Block time for hunt / weekend planning</li>
            </ul>
          </Card>
          <Card title="Next 3 Events">
            <p className="text-sm text-neutral-300 leading-relaxed">
              2:00 PM — HST Call Review
              <br />
              3:00 PM — Exec Touchpoint
              <br />
              5:30 PM — Family Dinner
            </p>
          </Card>
          <Card title="Quick Capture">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="h-9 flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Add task or note…"
              />
              <button
                type="submit"
                className="h-9 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-black hover:bg-emerald-400"
              >
                Add
              </button>
            </form>
          </Card>
        </section>

        {/* Main 3-column layout */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Column 1: Calendar / Tasks */}
          <div className="flex flex-col gap-4">
            <Card title="Calendar — Today & Tomorrow">
              <p className="mb-1 text-xs text-neutral-400">
                Phase 1: sample data. Phase 2: Google Calendar integration.
              </p>
              <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
                <li>Today: Exec check-in, HST follow-up, CGGC notes</li>
                <li>
                  Tomorrow: Deep work block, contract review, family event
                </li>
              </ul>
            </Card>
            <Card title="Tasks / Projects">
              <p className="mb-1 text-xs text-neutral-400">
                Personal · Home · Garden / CGGC
              </p>
              <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
                <li>Personal — finalize performance review, email Bruno</li>
                <li>Home — Sol-Ark design / budget outline</li>
                <li>Garden — CGGC starter package / bed layouts</li>
              </ul>
            </Card>
          </div>

          {/* Column 2: Daily Briefing & Markets */}
          <div className="flex flex-col gap-4">
            <Card title="Daily Briefing">
              <p className="mb-1 text-xs text-neutral-400">
                Phase 1: static summary. Phase 2: AI-generated briefing.
              </p>
              <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
                <li>Weather: 41°F, clear, light NW wind</li>
                <li>Time: Two solid deep work windows this afternoon</li>
                <li>
                  Risks: HST contract pressure, ECC backlog, staffing gaps
                </li>
                <li>
                  Opportunities: CGGC planning, AI/semis pullback, hunting
                  window this weekend
                </li>
              </ul>
            </Card>
            <Card title="Markets — Watchlist Snapshot">
              <p className="mb-1 text-xs text-neutral-400">
                Phase 1: sample data. Phase 2: live quotes + your scoring model.
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>MSFT</span>
                  <span className="text-emerald-400">+1.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>GOOG</span>
                  <span className="text-emerald-400">+0.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>RTX</span>
                  <span className="text-red-400">-0.6%</span>
                </div>
                <div className="flex justify-between">
                  <span>DUK</span>
                  <span className="text-emerald-400">+0.3%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Column 3: Weather & AI */}
          <div className="flex flex-col gap-4">
            <Card title="Weather & Situational Awareness">
              <p className="mb-1 text-xs text-neutral-400">
                Phase 1: static. Phase 2: OpenWeatherMap for Leominster / Mason
                NH.
              </p>
              <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
                <li>Today: 41°F high, 32°F low, clear</li>
                <li>Wind: NW 8 mph (check HuntOS stands)</li>
                <li>Next 5 days: Mostly clear, cooling trend</li>
              </ul>
            </Card>
            <Card title="AI Command Bar">
              <p className="mb-2 text-xs text-neutral-400">
                Phase 1: UI only. Phase 2: calls your OpenAI assistant route.
              </p>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={`Ask StephenOS:\n- "Summarize my day tomorrow."\n- "What are my top 3 priorities today?"\n- "How are my AI/semis positioned right now?"`}
              />
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
