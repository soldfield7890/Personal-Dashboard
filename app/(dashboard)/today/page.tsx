"use client";

import { useEffect, useMemo, useState } from "react";
import { useTasks } from "@/app/components/state/TaskStore";

function formatDay(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatGreetingHour(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TodayPage() {
  const { tasks } = useTasks();

  // Prevent SSR/client mismatch: compute time-based strings ONLY after mount
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const greeting = useMemo(() => {
    if (!now) return "Welcome";
    return `${formatGreetingHour(now)}, Stephen`;
  }, [now]);

  const dayLabel = useMemo(() => {
    if (!now) return "—";
    return formatDay(now);
  }, [now]);

  const criticalTodayCount = useMemo(() => {
    // Keep logic simple for now; refine later
    return tasks.filter((t) => t.status === "open" && t.priority === "critical").length;
  }, [tasks]);

  return (
    <div className="grid">
      <section className="card">
        <div className="card-title">PERSONAL COMMAND CENTER</div>
        <div className="muted">Today • {dayLabel}</div>
        <div className="headline">{greeting}</div>
        <div className="muted">
          {criticalTodayCount > 0
            ? `${criticalTodayCount} critical item(s) due today`
            : "No critical items due today"}
        </div>
      </section>

      <section className="card">
        <div className="card-title">NEXT 3 EVENTS</div>
        <div className="list">
          <div>2:00 PM — HST Call Review</div>
          <div>3:00 PM — Exec Touchpoint</div>
          <div>5:30 PM — Family Dinner</div>
        </div>
      </section>

      <section className="card">
        <div className="card-title">QUICK CAPTURE</div>
        <div className="muted">Adds to To-Do and persists.</div>
        <div className="row">
          <button className="btn">Add</button>
          <input className="input" placeholder="Add task or note..." />
        </div>
      </section>

      <section className="card">
        <div className="card-title">CALENDAR — TODAY &amp; Next Up</div>
        <ul>
          <li>Today: Exec check-in, HST follow-up, CGGC notes</li>
          <li>Next up:, Deep work block, contract review, family event</li>
        </ul>
      </section>

      <section className="card">
        <div className="card-title">DAILY BRIEFING</div>
        <ul>
          <li>Weather: 41°F, clear, light NW wind</li>
          <li>Time: Two strong deep-work windows</li>
          <li>Risks: HST pressure, ECC backlog</li>
          <li>Opportunities: CGGC planning, market pullback</li>
        </ul>
      </section>

      <section className="card">
        <div className="card-title">WEATHER &amp; SITUATIONAL AWARENESS</div>
        <div className="muted">Leominster / Mason NH</div>
        <ul>
          <li>Today: 41°F high, 32°F low, clear</li>
          <li>Wind: NW 8 mph (HuntOS check)</li>
          <li>Next 5 days: Mostly clear, cooling</li>
        </ul>
      </section>

      <section className="card">
        <div className="card-title">TASKS / PROJECTS</div>
        <div className="muted">Live tasks (from To-Do)</div>
        {tasks.filter((t) => t.status === "open").length === 0 ? (
          <div className="muted">No open tasks.</div>
        ) : (
          <div className="list">
            {tasks
              .filter((t) => t.status === "open")
              .slice(0, 5)
              .map((t) => (
                <div key={t.id}>{t.title}</div>
              ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-title">MARKETS — WATCHLIST SNAPSHOT</div>
        <div className="muted">Phase 1: sample • Phase 2: live quotes + scoring</div>
        <div className="markets">
          <div className="row-between">
            <div>MSFT</div>
            <div className="pos">+1.4%</div>
          </div>
          <div className="row-between">
            <div>GOOG</div>
            <div className="pos">+0.9%</div>
          </div>
          <div className="row-between">
            <div>RTX</div>
            <div className="neg">-0.6%</div>
          </div>
          <div className="row-between">
            <div>DUK</div>
            <div className="pos">+0.3%</div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-title">AI COMMAND BAR</div>
        <div className="muted">Phase 1: UI only • Phase 2: OpenAI route</div>
        <textarea
          className="textarea"
          placeholder={`Ask SEO Life OS:\n- "What are my top 3 priorities?"\n- "Summarize what's next."\n- "Any risks today?"`}
        />
      </section>
    </div>
  );
}
