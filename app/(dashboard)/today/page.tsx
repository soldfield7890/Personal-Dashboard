"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks } from "@/app/components/state/TaskStore";

function formatDowMonDay(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function greetingForHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TodayPage() {
  const { tasks, addTask } = useTasks();

  // ✅ Prevent hydration mismatch: render time/date ONLY after mount
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const openTasks = useMemo(() => tasks.filter((t) => t.status === "open"), [tasks]);

  const todayYmd = useMemo(() => {
    if (!now) return null;
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, [now]);

  const criticalDueToday = useMemo(() => {
    if (!todayYmd) return [];
    return openTasks.filter((t) => t.priority === 1 && t.dueDate === todayYmd);
  }, [openTasks, todayYmd]);

  const [quickText, setQuickText] = useState("");

  return (
    <div className="dash">
      <div className="grid-3">
        <Card title="PERSONAL COMMAND CENTER">
          <div className="muted">
            Today •{" "}
            <span suppressHydrationWarning>
              {now ? formatDowMonDay(now) : "—"}
            </span>
          </div>
          <div style={{ marginTop: 6, fontWeight: 600 }}>
            <span suppressHydrationWarning>
              {now ? `${greetingForHour(now.getHours())}, Stephen` : "Welcome back, Stephen"}
            </span>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            {criticalDueToday.length > 0
              ? `${criticalDueToday.length} critical item(s) due today`
              : "No critical items due today"}
          </div>
        </Card>

        <Card title="NEXT 3 EVENTS">
          <div className="list">
            <div>2:00 PM — HST Call Review</div>
            <div>3:00 PM — Exec Touchpoint</div>
            <div>5:30 PM — Family Dinner</div>
          </div>
        </Card>

        <Card
          title="QUICK CAPTURE"
          subtitle="Adds to To-Do and persists."
          right={
            <button
              className="btn"
              onClick={() => {
                addTask(quickText, 2, 0);
                setQuickText("");
              }}
            >
              Add
            </button>
          }
        >
          <input
            className="input"
            placeholder="Add task or note..."
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask(quickText, 2, 0);
                setQuickText("");
              }
            }}
          />
        </Card>
      </div>

      <div className="grid-3" style={{ marginTop: 18 }}>
        <Card title="CALENDAR — TODAY & TOMORROW" subtitle="Phase 1: sample • Phase 2: Google Calendar">
          <ul className="bullets">
            <li>Today: Exec check-in, HST follow-up, CGGC notes</li>
            <li>Tomorrow: Deep work block, contract review, family event</li>
          </ul>
        </Card>

        <Card title="DAILY BRIEFING" subtitle="Phase 1: static • Phase 2: AI-generated">
          <ul className="bullets">
            <li>Weather: 41°F, clear, light NW wind</li>
            <li>Time: Two strong deep-work windows</li>
            <li>Risks: HST pressure, ECC backlog</li>
            <li>Opportunities: CGGC planning, market pullback</li>
          </ul>
        </Card>

        <Card title="WEATHER & SITUATIONAL AWARENESS" subtitle="Leominster / Mason NH">
          <ul className="bullets">
            <li>Today: 41°F high, 32°F low, clear</li>
            <li>Wind: NW 8 mph (HuntOS check)</li>
            <li>Next 5 days: Mostly clear, cooling</li>
          </ul>
        </Card>
      </div>

      <div className="grid-3" style={{ marginTop: 18 }}>
        <Card title="TASKS / PROJECTS" subtitle="Live tasks (from To-Do)">
          {openTasks.length === 0 ? (
            <div className="muted">No open tasks.</div>
          ) : (
            <div className="list">
              {openTasks.slice(0, 4).map((t) => (
                <div key={t.id}>
                  • {t.title}
                  {t.priority === 1 ? " (CRITICAL)" : ""}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="MARKETS — WATCHLIST SNAPSHOT" subtitle="Phase 1: sample • Phase 2: live quotes + scoring">
          <div className="rows">
            <div className="row"><span>MSFT</span><span className="pos">+1.4%</span></div>
            <div className="row"><span>GOOG</span><span className="pos">+0.9%</span></div>
            <div className="row"><span>RTX</span><span className="neg">-0.6%</span></div>
            <div className="row"><span>DUK</span><span className="pos">+0.3%</span></div>
          </div>
        </Card>

        <Card title="AI COMMAND BAR" subtitle="Phase 1: UI only • Phase 2: OpenAI route">
          <textarea
            className="textarea"
            placeholder={`Ask SEO Life OS:\n- "What are my top 3 priorities?"\n- "Summarize tomorrow."\n- "Any risks today?"`}
          />
        </Card>
      </div>
    </div>
  );
}
