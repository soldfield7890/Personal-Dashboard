cat > "app/(dashboard)/today/page.tsx" << 'EOF'
"use client";

import { Card } from "@/app/components/Card";

export default function TodayPage() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
      {/* Top row */}
      <section className="grid gap-3 sm:grid-cols-3 items-stretch">
        <Card title="Personal Command Center">
          <div className="text-xs text-neutral-400">Today • {today}</div>
          <div className="mt-1 text-base font-semibold text-neutral-100">
            Good afternoon, Stephen
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            3 meetings · 7 tasks · 41°F (sample)
          </div>
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
      <section className="grid gap-4 lg:grid-cols-3 items-stretch">
        <div className="flex flex-col gap-4">
          <Card title="Calendar — Today & Tomorrow">
            <p className="mb-1 text-xs text-neutral-400">
              Phase 1: sample data. Phase 2: Google Calendar integration.
            </p>
            <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
              <li>Today: Exec check-in, HST follow-up, CGGC notes</li>
              <li>Tomorrow: Deep work block, contract review, family event</li>
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

        <div className="flex flex-col gap-4">
          <Card title="Daily Briefing">
            <p className="mb-1 text-xs text-neutral-400">
              Phase 1: static summary. Phase 2: AI-generated briefing.
            </p>
            <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
              <li>Weather: 41°F, clear, light NW wind</li>
              <li>Time: Two solid deep work windows this afternoon</li>
              <li>Risks: HST contract pressure, ECC backlog, staffing gaps</li>
              <li>
                Opportunities: CGGC planning, AI/semis pullback, hunting window
                this weekend
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

        <div className="flex flex-col gap-4">
          <Card title="Weather & Situational Awareness">
            <p className="mb-1 text-xs text-neutral-400">
              Phase 1: static. Phase 2: OpenWeatherMap for Leominster / Mason NH.
            </p>
            <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
              <li>Today: 41°F high, 32°F low, clear</li>
              <li>Wind: NW 8 mph (check HuntOS stands)</li>
              <li>Next 5 days: Mostly clear, cooling trend</li>
            </ul>
          </Card>

          <Card title="AI Command Bar" className="flex flex-col">
            <p className="mb-2 text-xs text-neutral-400">
              Phase 1: UI only. Phase 2: calls your OpenAI assistant route.
            </p>
            <textarea
              rows={6}
              className="mt-auto w-full flex-1 min-h-[120px] resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder={`Ask StephenOS:\n- "Summarize my day tomorrow."\n- "What are my top 3 priorities today?"\n- "How are my AI/semis positioned right now?"`}
            />
          </Card>
        </div>
      </section>
    </div>
  );
}
EOF
