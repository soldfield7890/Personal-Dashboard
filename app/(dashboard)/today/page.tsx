"use client";

import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks, type Task, type TaskPriority } from "@/app/state/TaskStore";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export default function TodayPage() {
  const { tasks, addTask } = useTasks();

  const [quickText, setQuickText] = useState("");

  const now = useMemo(() => new Date(), []);
  const todayYmd = useMemo(() => ymd(new Date()), []);
  const monthTitle = useMemo(() => monthLabel(new Date()), []);

  const openTasks = useMemo(
    () => tasks.filter((t: Task) => t.status !== "done"),
    [tasks]
  );

  const criticalDueTodayCount = useMemo(() => {
    return openTasks.filter(
      (t: Task) => t.priority === 1 && t.dueDate === todayYmd
    ).length;
  }, [openTasks, todayYmd]);

  const openCount = useMemo(() => openTasks.length, [openTasks]);

  const topPriorities = useMemo(() => {
    // “Focus lane”: open tasks, priority first, then due date
    const sorted = [...openTasks].sort((a: Task, b: Task) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      const da = a.dueDate ?? "9999-99-99";
      const db = b.dueDate ?? "9999-99-99";
      return da.localeCompare(db);
    });

    return sorted.slice(0, 5);
  }, [openTasks]);

  function commitQuick(priority: TaskPriority) {
    const v = quickText.trim();
    if (!v) return;
    addTask(v, priority, 0);
    setQuickText("");
  }

  // Simple month grid (visual only; no click behavior yet)
  const monthGrid = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth();

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const startDow = first.getDay(); // 0=Sun
    const daysInMonth = last.getDate();

    const cells: Array<{ label: string; isDay: boolean; isToday?: boolean }> = [];

    // leading blanks
    for (let i = 0; i < startDow; i++) cells.push({ label: "", isDay: false });

    for (let day = 1; day <= daysInMonth; day++) {
      const dt = new Date(y, m, day);
      const isToday = ymd(dt) === todayYmd;
      cells.push({ label: String(day), isDay: true, isToday });
    }

    // pad to full weeks
    while (cells.length % 7 !== 0) cells.push({ label: "", isDay: false });

    return cells;
  }, [todayYmd]);

  // Stubs (keep behavior stable)
  const next3Events = useMemo(
    () => [
      { time: "2:00 PM", title: "HST Call Review" },
      { time: "3:00 PM", title: "Exec Touchpoint" },
      { time: "5:30 PM", title: "Family Dinner" },
    ],
    []
  );

  const marketsStub = useMemo(
    () => [
      { sym: "MSFT", chg: "+1.4%" },
      { sym: "GOOG", chg: "+0.9%" },
      { sym: "RTX", chg: "-0.6%" },
      { sym: "DUK", chg: "+0.3%" },
    ],
    []
  );

  return (
    <div className="dash">
      {/* Header */}
      <Card
        title="PERSONAL COMMAND CENTER"
        subtitle={`Today • ${now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}`}
        right={
          <span className="badge">
            {criticalDueTodayCount > 0
              ? `Critical due today: ${criticalDueTodayCount}`
              : "No critical due today"}
          </span>
        }
      >
        <div className="chipRow">
          <span className="badge">{openCount} open</span>
          <span className="badge">2 deep-work blocks</span>
          <span className="badge">Market: watchlist ready</span>
        </div>
      </Card>

      {/* Main grid: left lane + right rail */}
      <div className="grid-2" style={{ marginTop: 18 }}>
        {/* LEFT LANE */}
        <div className="vlist" style={{ gap: 18 }}>
          <Card title="CALENDAR" subtitle="Today & Next Up (Phase 1 stub)">
            <div className="vlist">
              {next3Events.map((e) => (
                <div key={`${e.time}-${e.title}`} className="vrow">
                  <div style={{ fontWeight: 800 }}>{e.time}</div>
                  <div className="muted">{e.title}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="FOCUS LANE"
            subtitle="Top priorities (auto-ranked)"
          >
            {topPriorities.length === 0 ? (
              <div className="muted">
                No open tasks yet. Quick-capture one thing and the OS will build around it.
              </div>
            ) : (
              <div className="vlist">
                {topPriorities.map((t: Task) => (
                  <div key={t.id} className="vrow" style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span className={t.priority === 1 ? "bullet bullet-red" : "bullet"} />
                      <div style={{ minWidth: 0 }}>
                        <div className="truncate text-sm" style={{ fontWeight: 800 }}>
                          {t.title}
                        </div>
                        <div className="muted">
                          {t.dueDate ? `Due: ${t.dueDate}` : "No due date"} •{" "}
                          {t.priority === 1 ? "Critical" : t.priority === 2 ? "Normal" : "Low"}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto" }} className="muted">
                      {t.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="DAILY BRIEFING" subtitle="Phase 1: static • Phase 2: AI-generated">
            <div className="vlist">
              <div>Weather: 41°F, clear, light NW wind</div>
              <div>Time: Two strong deep-work windows</div>
              <div>Risks: HST pressure, ECC backlog</div>
              <div>Opportunities: CGGC planning, market pullback</div>
            </div>
          </Card>
        </div>

        {/* RIGHT RAIL */}
        <div className="vlist" style={{ gap: 18 }}>
          <Card
            title="QUICK CAPTURE"
            subtitle="Adds to To-Do and persists."
            right={
              <button className="btn" onClick={() => commitQuick(2)}>
                Add
              </button>
            }
          >
            <input
              className="input"
              placeholder='Type and hit Enter... (try: "Send Steve spreadsheet")'
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitQuick(2);
              }}
            />

            <div className="chipRow" style={{ marginTop: 10 }}>
              <button className="btn btn-green" onClick={() => commitQuick(1)}>
                Add as CRITICAL
              </button>
              <button className="btn" onClick={() => commitQuick(2)}>
                Add as Normal
              </button>
              <button className="btn" onClick={() => commitQuick(3)}>
                Add as Low
              </button>
            </div>
          </Card>

          <Card title="MONTH" subtitle={monthTitle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              {monthGrid.map((c, idx) => (
                <div
                  key={idx}
                  className="badge"
                  style={{
                    opacity: c.isDay ? 1 : 0.2,
                    textAlign: "center",
                    padding: "10px 0",
                    border:
                      c.isToday ? "1px solid rgba(34, 197, 94, .55)" : undefined,
                  }}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </Card>

          <Card title="MARKETS" subtitle="Watchlist snapshot (Phase 1 stub)">
            <div className="vlist">
              {marketsStub.map((m) => (
                <div key={m.sym} className="vrow">
                  <div style={{ fontWeight: 800 }}>{m.sym}</div>
                  <div
                    className="muted"
                    style={{
                      marginLeft: "auto",
                      fontWeight: 800,
                      color: m.chg.startsWith("-") ? "#f87171" : "#34d399",
                    }}
                  >
                    {m.chg}
                  </div>
                </div>
              ))}
              <div className="muted" style={{ marginTop: 8 }}>
                Phase 2: live quotes + scoring + alerts
              </div>
            </div>
          </Card>

          <Card title="AI COMMAND BAR" subtitle="Phase 1: UI • Phase 2: OpenAI route">
            <div className="vrow" style={{ gap: 10 }}>
              <input className="input" placeholder='Ask SEO Life OS... (ex: "What are my top 3 priorities?")' />
              <button className="btn">Ask</button>
            </div>
            <div className="muted" style={{ marginTop: 8 }}>
              Phase 2: wire to API route + OpenAI. This is a visual placeholder only.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
