"use client";

import { Card } from "@/app/components/ui/Card";

export default function TodayPage() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* ───────────────── Top Row ───────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Personal Command Center">
          <p className="text-xs text-neutral-400">Today • {today}</p>
          <p className="mt-1 font-semibold">Good afternoon, Stephen</p>
          <p className="mt-1 text-sm text-neutral-400">
            3 meetings · 7 tasks · 41°F (sample)
          </p>
        </Card>

        <Card title="Next 3 Events">
          <ul className="space-y-1 text-sm text-neutral-300">
            <li>2:00 PM — HST Call Review</li>
            <li>3:00 PM — Exec Touchpoint</li>
            <li>5:30 PM — Family Dinner</li>
          </ul>
        </Card>

        <Card title="Quick Capture">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
              placeholder="Add task or note…"
            />
            <button className="rounded-lg bg-emerald-500 px-3 text-xs font-semibold text-black">
              Add
            </button>
          </div>
        </Card>
      </section>

      {/* ──────────────── Second Row ──────────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Calendar — Today & Tomorrow">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: sample data · Phase 2: Google Calendar
          </p>
          <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
            <li>Today: Exec check-in, HST follow-up, CGGC notes</li>
            <li>Tomorrow: Deep work block, contract review, family event</li>
          </ul>
        </Card>

        <Card title="Daily Briefing">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: static · Phase 2: AI-generated
          </p>
          <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
            <li>Weather: 41°F, clear, light NW wind</li>
            <li>Time: Two strong deep-work windows</li>
            <li>Risks: HST pressure, ECC backlog</li>
            <li>Opportunities: CGGC planning, market pullback</li>
          </ul>
        </Card>

        <Card title="Weather & Situational Awareness">
          <p className="mb-2 text-xs text-neutral-400">
            Leominster / Mason NH
          </p>
          <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
            <li>Today: 41°F high, 32°F low, clear</li>
            <li>Wind: NW 8 mph (HuntOS check)</li>
            <li>Next 5 days: Mostly clear, cooling</li>
          </ul>
        </Card>
      </section>
      {/* ──────────────── Third Row ──────────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Tasks / Projects">
          <p className="mb-2 text-xs text-neutral-400">
            Personal · Home · Garden / CGGC
          </p>
          <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
            <li>Personal — finalize performance review, email Bruno</li>
            <li>Home — Sol-Ark design / budget outline</li>
            <li>Garden — CGGC starter package / bed layouts</li>
          </ul>
        </Card>

        <Card title="Markets — Watchlist Snapshot">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: sample data · Phase 2: live quotes + scoring
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

        <Card title="AI Command Bar">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: UI only · Phase 2: OpenAI assistant
          </p>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
            placeholder={`Ask SEO Life OS:
- "Summarize my day tomorrow"
- "What are my top 3 priorities?"
- "How are my AI/semis positioned?"`}
          />
        </Card>
      </section>

    </div>
  );
}
