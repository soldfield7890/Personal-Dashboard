"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks, type TaskPriority } from "@/app/components/state/TaskStore";

function formatDowMonDay(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function greetingForHour(h: number) {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

type MonthCell = { key: string; label: string; isToday?: boolean; isBlank?: boolean };

function buildMonthCells(now: Date): MonthCell[] {
  const y = now.getFullYear();
  const m = now.getMonth();

  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  // Monday-first grid: Mon=0 ... Sun=6
  const firstDow = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();

  const cells: MonthCell[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ key: `b${i}`, label: "", isBlank: true });

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      key: `d${day}`,
      label: String(day),
      isToday: day === now.getDate(),
    });
  }

  while (cells.length % 7 !== 0) cells.push({ key: `t${cells.length}`, label: "", isBlank: true });
  return cells.slice(0, 42);
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TodayPage() {
  const { tasks, addTask } = useTasks();

  // Prevent hydration mismatch
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  // Store model uses `done` boolean (no `status`)
  const openTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

  const todayYmd = useMemo(() => {
    if (!now) return null;
    return toYmd(now);
  }, [now]);

  const criticalDueToday = useMemo(() => {
    if (!todayYmd) return [];
    return openTasks.filter((t) => t.priority === 1 && t.dueDate === todayYmd);
  }, [openTasks, todayYmd]);

  const rankedOpen = useMemo(() => {
    return [...openTasks].sort((a, b) => {
      const pa = a.priority ?? 9;
      const pb = b.priority ?? 9;
      if (pa !== pb) return pa - pb;

      const da = a.dueDate ?? "9999-99-99";
      const db = b.dueDate ?? "9999-99-99";
      return da.localeCompare(db);
    });
  }, [openTasks]);

  const topPriorities = rankedOpen.slice(0, 5);

  const systemStatus = useMemo(() => {
    if (criticalDueToday.length > 0) return "RED";
    if (openTasks.length >= 8) return "YELLOW";
    return "GREEN";
  }, [criticalDueToday.length, openTasks.length]);

  // Your CSS has `.dot` and `.bullet-red`, but not dot-red/yellow; keep dot base.
  const dotClass = "dot";

  const monthLabel = now ? now.toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "—";
  const monthCells = useMemo(() => (now ? buildMonthCells(now) : []), [now]);

  const [quickText, setQuickText] = useState("");

  function commitQuick(priority: TaskPriority) {
    const v = quickText.trim();
    if (!v) return;

    // Do NOT pass 0. Due date should be a string (YYYY-MM-DD) or undefined.
    addTask(v, priority);

    setQuickText("");
  }

  return (
    <div className="grid">
      <Card
        className={`tile-command ${criticalDueToday.length > 0 ? "tile-critical" : ""}`}
        title="PERSONAL COMMAND CENTER"
        subtitle={
          now ? `Today • ${formatDowMonDay(now)} • ${greetingForHour(now.getHours())}, Stephen` : "Loading…"
        }
        right={
          <div className="pill small">
            <span className={dotClass} />
            <span>System: {systemStatus}</span>
          </div>
        }
      >
        <div className="chipRow">
          <span className={`badge ${criticalDueToday.length ? "badge-red" : ""}`}>
            {criticalDueToday.length ? `${criticalDueToday.length} critical due today` : "No critical due today"}
          </span>
          <span className="badge">{openTasks.length} open</span>
          <span className="badge">2 deep-work blocks</span>
          <span className="badge">Market: watchlist ready</span>
        </div>

        <div className="headsUp">
          <div className="headsUpKicker">HEADS UP</div>
          {criticalDueToday.length ? (
            <div>Clear critical items early — the cockpit will auto-expand around them.</div>
          ) : (
            <div>Keep it clean: capture fast, choose one focus lane, protect deep work.</div>
          )}
        </div>
      </Card>

      <Card
        className={`tile-actions ${criticalDueToday.length ? "tile-grow" : ""}`}
        title="QUICK CAPTURE"
        subtitle="Adds to To-Do and persists."
        right={
          <button className="btn btn-green" onClick={() => commitQuick(2)}>
            Add
          </button>
        }
      >
        <input
          className="input"
          placeholder='Type and hit Enter… (try: "Send Steve spreadsheet")'
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitQuick(2);
          }}
        />

        <div className="qaGrid" style={{ marginTop: 10 }}>
          <button className="qaBtn" onClick={() => commitQuick(1)}>
            Add as CRITICAL
          </button>
          <button className="qaBtn" onClick={() => commitQuick(2)}>
            Add as Normal
          </button>
        </div>
      </Card>

      <Card className="tile-focus" title="FOCUS LANE" subtitle="Top priorities (auto-ranked)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          {topPriorities.length === 0 ? (
            <div className="muted">No open tasks yet. Quick-capture one thing and the OS will build around it.</div>
          ) : (
            topPriorities.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.06)",
                  background: "rgba(0,0,0,.10)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span className={t.priority === 1 ? "bullet bullet-red" : "bullet"} />
                  <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.title} {t.priority === 1 ? <span className="muted">• CRITICAL</span> : null}
                  </div>
                </div>
                <div className="mutedRight">{t.dueDate ? t.dueDate : ""}</div>
              </div>
            ))
          )}
        </div>

        <div className="focusBlocks">
          <div className="focusBlock">
            <div className="focusBlockTitle">Deep Work</div>
            <div className="muted">AM block + PM block (protect these like meetings)</div>
          </div>
          <div className="focusBlock">
            <div className="focusBlockTitle">Admin</div>
            <div className="muted">Batch comms + approvals + follow-ups</div>
          </div>
        </div>
      </Card>

      <Card className="tile-month" title="MONTH" subtitle={monthLabel}>
        <div className="monthGrid">
          {monthCells.length === 0 ? (
            <div className="muted">—</div>
          ) : (
            monthCells.map((c) => (
              <div
                key={c.key}
                className={`dayPill ${c.isToday ? "today" : ""}`}
                style={{ opacity: c.isBlank ? 0.25 : 1 }}
              >
                {c.label}
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="tile-calendar" title="CALENDAR" subtitle="Today & Next Up (Phase 1 stub)">
        <div className="twoCol">
          <div>
            <div className="colTitle">Today</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>2:00 PM — HST Call Review</span>
                <span className="mutedRight">Hard</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>3:00 PM — Exec Touchpoint</span>
                <span className="mutedRight">Med</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>5:30 PM — Family Dinner</span>
                <span className="mutedRight">Good</span>
              </div>
            </div>
          </div>

          <div>
            <div className="colTitle">Next Up</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
              <div>Deep work block</div>
              <div>Contract review</div>
              <div>Family event</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="tile-markets" title="MARKETS" subtitle="Watchlist snapshot (Phase 1 stub)">
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>MSFT</span>
            <span className="pos">+1.4%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>GOOG</span>
            <span className="pos">+0.9%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>RTX</span>
            <span className="neg">-0.6%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>DUK</span>
            <span className="pos">+0.3%</span>
          </div>
        </div>

        <div className="miniChart">Phase 2: live quotes + scoring + alerts</div>
      </Card>

      <Card className="tile-brief" title="DAILY BRIEFING" subtitle="Phase 1: static • Phase 2: AI-generated">
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
          <div>Weather: 41°F, clear, light NW wind</div>
          <div>Risks: HST pressure, ECC backlog</div>
          <div>Opportunities: CGGC planning, market pullback</div>
          <div className="muted">Next: AI generates 3 bullets + 1 recommendation.</div>
        </div>
      </Card>

      <Card className="tile-weather" title="AI COMMAND BAR" subtitle="Phase 1: UI • Phase 2: OpenAI route">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            className="input"
            placeholder='Ask SEO Life OS… (ex: "What are my top 3 priorities?")'
            value={""}
            onChange={() => {}}
            readOnly
          />
          <button className="btn" type="button" disabled>
            Ask
          </button>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Phase 2: wire to an API route + OpenAI. This is a visual placeholder only.
        </div>
      </Card>
    </div>
  );
}
