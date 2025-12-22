"use client";

import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks, type TaskPriority, type Task } from "@/app/state/TaskStore";

type Filter = "open" | "today" | "done" | "all";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TodoPage() {
  const { tasks, addTask, toggleTask, removeTask, clearDone } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(2);
  const [dueInDays, setDueInDays] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>("open");

  const today = useMemo(() => ymd(new Date()), []);

  const counts = useMemo(() => {
    const open = tasks.filter((t: Task) => t.status !== "done").length;
    const done = tasks.filter((t: Task) => t.status === "done").length;
    const dueToday = tasks.filter(
      (t: Task) => t.status !== "done" && t.dueDate === today
    ).length;
    return { open, done, dueToday, total: tasks.length };
  }, [tasks, today]);

  const visible = useMemo(() => {
    const base = [...tasks].sort((a: Task, b: Task) => {
      // priority asc (1 critical first), then dueDate asc (earliest first)
      if (a.priority !== b.priority) return a.priority - b.priority;
      const da = a.dueDate ?? "9999-99-99";
      const db = b.dueDate ?? "9999-99-99";
      return da.localeCompare(db);
    });

    if (filter === "all") return base;
    if (filter === "done") return base.filter((t: Task) => t.status === "done");
    if (filter === "today")
      return base.filter(
        (t: Task) => t.status !== "done" && t.dueDate === today
      );
    return base.filter((t: Task) => t.status !== "done");
  }, [tasks, filter, today]);

  function commit() {
    const v = title.trim();
    if (!v) return;

    // addTask(title, priority, dueInDays)
    addTask(v, priority, dueInDays);

    setTitle("");
    setPriority(2);
    setDueInDays(0);
    setFilter("open");
  }

  return (
    <div className="dash">
      {/* Top row: Add + Filters + Summary */}
      <div className="grid-3">
        <Card
          title="TO-DO COMMAND CENTER"
          subtitle="Local-first tasks. Status + priority + due date."
          right={
            <button className="btn" onClick={commit}>
              Add
            </button>
          }
        >
          <input
            className="input"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
          />

          <div className="chipRow" style={{ marginTop: 10 }}>
            <span className="badge">
              Priority:&nbsp;
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(Number(e.target.value) as TaskPriority)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  fontWeight: 800,
                }}
              >
                <option value={1}>CRITICAL</option>
                <option value={2}>NORMAL</option>
                <option value={3}>LOW</option>
              </select>
            </span>

            <span className="badge">
              Due:&nbsp;
              <select
                value={dueInDays}
                onChange={(e) => setDueInDays(Number(e.target.value))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  fontWeight: 800,
                }}
              >
                <option value={0}>No due date</option>
                <option value={1}>+1 day</option>
                <option value={2}>+2 days</option>
                <option value={7}>+7 days</option>
              </select>
            </span>

            <button className="btn" onClick={clearDone} style={{ marginLeft: "auto" }}>
              Clear Done
            </button>
          </div>
        </Card>

        <Card title="FILTERS" subtitle="Choose your lane">
          <div className="qaGrid">
            <button className="qaBtn" onClick={() => setFilter("open")}>
              OPEN
            </button>
            <button className="qaBtn" onClick={() => setFilter("today")}>
              TODAY
            </button>
            <button className="qaBtn" onClick={() => setFilter("done")}>
              DONE
            </button>
            <button className="qaBtn" onClick={() => setFilter("all")}>
              ALL
            </button>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Viewing: <b>{filter.toUpperCase()}</b>
          </div>
        </Card>

        <Card title="SUMMARY" subtitle="Live counts">
          <div className="vlist">
            <div>Total: {counts.total}</div>
            <div>Open: {counts.open}</div>
            <div>Due today: {counts.dueToday}</div>
            <div>Done: {counts.done}</div>
          </div>
        </Card>
      </div>

      {/* Second row: Tasks list full width */}
      <div style={{ marginTop: 18 }}>
        <Card title="TASK LIST" subtitle="Toggle done, remove tasks, scan urgency fast.">
          {visible.length === 0 ? (
            <div className="muted">No tasks for this view.</div>
          ) : (
            <div className="vlist">
              {visible.map((t: Task) => (
                <div key={t.id} className="vrow" style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span className={t.priority === 1 ? "bullet bullet-red" : "bullet"} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        className={`truncate text-sm ${
                          t.status === "done"
                            ? "text-neutral-500 line-through"
                            : "text-neutral-100"
                        }`}
                        style={{ fontWeight: 800 }}
                      >
                        {t.title}
                      </div>
                      <div className="muted">
                        {t.dueDate ? `Due: ${t.dueDate}` : "No due date"} •{" "}
                        {t.priority === 1 ? "Critical" : t.priority === 2 ? "Normal" : "Low"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                    <button className="btn" onClick={() => toggleTask(t.id)}>
                      {t.status === "done" ? "Reopen" : "Done"}
                    </button>
                    <button className="btn" onClick={() => removeTask(t.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
