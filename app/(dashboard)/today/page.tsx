"use client";

import { Card } from "@/app/components/ui/Card";
import React, { useMemo, useState } from "react";
import { useTasks } from "@/app/components/state/TaskStore";

export default function TodayPage() {
  const { addTask, tasks, criticalTodayCount } = useTasks();
  const [capture, setCapture] = useState("");

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const topTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.done)
      .slice(0, 4);
  }, [tasks]);

  const tasksCardClass =
    criticalTodayCount > 0 ? "tile-grow tile-critical" : "";

  const onAdd = () => {
    const title = capture.trim();
    if (!title) return;
    addTask({ title, priority: "normal" });
    setCapture("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Row 1 */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Personal Command Center">
          <p className="text-xs text-neutral-400">Today • {todayLabel}</p>
          <p className="mt-1 font-semibold">Good afternoon, Stephen</p>
          <p className="mt-1 text-sm text-neutral-400">
            {criticalTodayCount > 0 ? (
              <span className="text-emerald-300">
                {criticalTodayCount} critical due today
              </span>
            ) : (
              <span className="text-neutral-500">No critical items due today</span>
            )}
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
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <input
              value={capture}
              onChange={(e) => setCapture(e.target.value)}
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
              placeholder="Add task or note…"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-3 text-xs font-semibold text-black"
            >
              Add
            </button>
          </form>
          <p className="mt-2 text-xs text-neutral-500">
            Adds to To-Do and persists.
          </p>
        </Card>
      </section>

      {/* Row 2 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Calendar — Today & Tomorrow">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: sample · Phase 2: Google Calendar
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
          <p className="mb-2 text-xs text-neutral-400">Leominster / Mason NH</p>
          <ul className="list-disc pl-4 text-sm text-neutral-300 space-y-1">
            <li>Today: 41°F high, 32°F low, clear</li>
            <li>Wind: NW 8 mph</li>
            <li>Next 5 days: Mostly clear, cooling</li>
          </ul>
        </Card>
      </section>

      {/* Row 3 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Tasks / Projects" className={tasksCardClass}>
          <p className="mb-2 text-xs text-neutral-400">
            Live tasks (from To-Do)
          </p>
          {topTasks.length === 0 ? (
            <p className="text-sm text-neutral-400">No open tasks.</p>
          ) : (
            <ul className="text-sm text-neutral-200 space-y-1">
              {topTasks.map((t) => (
                <li key={t.id} className="flex justify-between gap-2">
                  <span className="truncate">{t.title}</span>
                  <span className="text-xs text-neutral-500">{t.priority}</span>
                </li>
              ))}
            </ul>
          )}
          {criticalTodayCount > 0 && (
            <p className="mt-2 text-xs text-emerald-300">
              Critical today detected → this tile grows.
            </p>
          )}
        </Card>

        <Card title="Markets — Watchlist Snapshot">
          <p className="mb-2 text-xs text-neutral-400">
            Phase 1: sample · Phase 2: live quotes + scoring
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
            Phase 1: UI only · Phase 2: OpenAI route
          </p>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
            placeholder={`Ask SEO Life OS:\n- "What are my top 3 priorities?"\n- "Summarize tomorrow."\n- "Any risks today?"`}
          />
        </Card>
      </section>
    </div>
  );
}
