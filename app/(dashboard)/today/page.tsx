"use client";

import React, { useMemo, useState } from "react";
import { useTaskStore, TaskPriority, Task } from "@/app/lib/taskStore";

const P1_CRITICAL: TaskPriority = 1;
const P2_NORMAL: TaskPriority = 2;
const P3_LOW: TaskPriority = 3;

function priorityLabel(p: TaskPriority) {
  if (p === 1) return "CRITICAL";
  if (p === 2) return "NORMAL";
  return "LOW";
}

function priorityRank(p: TaskPriority) {
  return p; // 1 best
}

function sortFocusLane(tasks: Task[]) {
  // Open first, then priority (1..3), then newest
  return [...tasks]
    .filter((t) => t.status === "open")
    .sort((a, b) => {
      const pr = priorityRank(a.priority) - priorityRank(b.priority);
      if (pr !== 0) return pr;
      return b.createdAt - a.createdAt;
    })
    .slice(0, 6);
}

export default function TodayPage() {
  const { tasks, addTask } = useTaskStore();
  const [quick, setQuick] = useState("");

  const openCount = useMemo(() => tasks.filter((t) => t.status === "open").length, [tasks]);

  const focusLane = useMemo(() => sortFocusLane(tasks), [tasks]);

  function submit(priority: TaskPriority) {
    const text = quick.trim();
    if (!text) return;
    addTask(text, priority);
    setQuick("");
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="card headerCard">
        <div>
          <div className="kicker">PERSONAL COMMAND CENTER</div>
          <div className="title">Today · Mon Dec 22</div>
        </div>

        <div className="pillRow">
          <span className="pill">{openCount} open</span>
          <span className="pill good">Market ready</span>
        </div>
      </div>

      {/* GRID */}
      <div className="todayGrid">
        {/* CALENDAR */}
        <div className="card">
          <div className="cardTitle">CALENDAR</div>
          <div className="muted">Today & Next Up (Phase 1 stub)</div>
          <div className="list">
            <div className="listRow">
              <span className="strong">2:00 PM</span>
              <span className="muted">—</span>
              <span>HST Call Review</span>
            </div>
            <div className="listRow">
              <span className="strong">3:00 PM</span>
              <span className="muted">—</span>
              <span>Exec Touchpoint</span>
            </div>
            <div className="listRow">
              <span className="strong">5:30 PM</span>
              <span className="muted">—</span>
              <span>Family Dinner</span>
            </div>
          </div>
        </div>

        {/* QUICK CAPTURE */}
        <div className="card">
          <div className="cardTitle">QUICK CAPTURE</div>
          <div className="muted">Adds to To-Do and persists.</div>

          <div className="stack">
            <input
              className="input"
              value={quick}
              placeholder={`Type and hit Enter... (try: "Send Steve spreadsheet")`}
              onChange={(e) => setQuick(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(P2_NORMAL);
              }}
            />

            <div className="btnRow">
              <button className="btn danger" onClick={() => submit(P1_CRITICAL)}>
                Add as CRITICAL
              </button>
              <button className="btn" onClick={() => submit(P2_NORMAL)}>
                Add as Normal
              </button>
              <button className="btn subtle" onClick={() => submit(P3_LOW)}>
                Add as Low
              </button>
            </div>
          </div>
        </div>

        {/* FOCUS LANE */}
        <div className="card focusCard">
          <div className="cardTitle">FOCUS LANE</div>
          <div className="muted">Top priorities (auto-ranked)</div>

          {focusLane.length === 0 ? (
            <div className="empty">No open tasks. You’re clear.</div>
          ) : (
            <div className="focusList">
              {focusLane.map((t) => (
                <div className="focusItem" key={t.id}>
                  <div className="focusMain">
                    <div className="strong">{t.title}</div>
                    <div className="muted">
                      No due date · {priorityLabel(t.priority)} (P{t.priority})
                    </div>
                  </div>
                  <span
                    className={
                      t.priority === 1 ? "dot danger" : t.priority === 2 ? "dot info" : "dot"
                    }
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DAILY BRIEFING */}
        <div className="card">
          <div className="cardTitle">DAILY BRIEFING</div>
          <div className="muted">Phase 1: static · Phase 2: AI-generated</div>

          <div className="brief">
            <div>
              <span className="strong">Weather:</span> 41°F, clear
            </div>
            <div>
              <span className="strong">Risk:</span> ECC backlog
            </div>
            <div>
              <span className="strong">Opportunity:</span> CGGC planning
            </div>
          </div>
        </div>

        {/* MARKETS */}
        <div className="card marketsCard">
          <div className="cardTitle">MARKETS</div>
          <div className="muted">Watchlist snapshot</div>
          <div className="muted" style={{ marginTop: 10 }}>
            Coming next: scoring + buy-under targets + alerts.
          </div>
        </div>
      </div>
    </div>
  );
}
