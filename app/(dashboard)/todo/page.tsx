"use client";

import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks, type TaskPriority } from "@/app/components/state/TaskStore";

type Filter = "open" | "today" | "done" | "all";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ymdFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return ymd(d);
}

export default function TodoPage() {
  const { tasks, addTask, toggleDone, removeTask } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(2);
  const [dueInDays, setDueInDays] = useState<number>(0);
  const [filter, setFilter] = useState<Filter>("open");

  const today = ymd(new Date());

  const counts = useMemo(() => {
    const open = tasks.filter((t) => !t.done).length;
    const done = tasks.filter((t) => t.done).length;
    const dueToday = tasks.filter((t) => !t.done && t.dueDate === today).length;
    return { open, done, dueToday, total: tasks.length };
  }, [tasks, today]);

  const visible = useMemo(() => {
    const base = [...tasks].sort((a, b) => {
      // priority asc, then dueDate asc
      const pa = a.priority ?? 99;
      const pb = b.priority ?? 99;
      if (pa !== pb) return pa - pb;
      const da = a.dueDate ?? "9999-99-99";
      const db = b.dueDate ?? "9999-99-99";
      return da.localeCompare(db);
    });

    if (filter === "all") return base;
    if (filter === "done") return base.filter((t) => t.done);
    if (filter === "today") return base.filter((t) => !t.done && t.dueDate === today);
    return base.filter((t) => !t.done);
  }, [tasks, filter, today]);

  function commit() {
    const v = title.trim();
    if (!v) return;

    const dueDate = dueInDays > 0 ? ymdFromNow(dueInDays) : undefined;

    // addTask expects (title, priority, dueDate?)
    addTask(v, priority, dueDate);

    setTitle("");
    setPriority(2);
    setDueInDays(0);
    setFilter("open");
  }

  return (
    <div className="grid">
      <Card
        className="tile-actions"
        title="ADD TASK"
        subtitle="Capture fast. Keep momentum."
        right={
          <button className="btn btn-green" onClick={commit}>
            Add Task
          </button>
        }
      >
        <input
          className="input"
          placeholder="Task title…"
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
              onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
              style={{ background: "transparent", border: "none", color: "inherit", fontWeight: 800 }}
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
              style={{ background: "transparent", border: "none", color: "inherit", fontWeight: 800 }}
            >
              <option value={0}>No due date</option>
              <option value={1}>+1 day</option>
              <option value={2}>+2 days</option>
              <option value={7}>+7 days</option>
            </select>
          </span>
        </div>
      </Card>

      <Card className="tile-month" title="FILTERS" subtitle="Choose your lane">
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
      </Card>

      <Card className="tile-markets" title="SUMMARY" subtitle="Real-time counts">
        <div className="vlist">
          <div>Total: {counts.total}</div>
          <div>Open: {counts.open}</div>
          <div>Due today: {counts.dueToday}</div>
          <div>Done: {counts.done}</div>
        </div>
      </Card>

      <Card className="tile-command" title="TASKS" subtitle={filter.toUpperCase()}>
        {visible.length === 0 ? (
          <div className="muted">No tasks for this view.</div>
        ) : (
          <div className="vlist">
            {visible.map((t) => (
              <div key={t.id} className="vrow" style={{ alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={t.priority === 1 ? "bullet bullet-red" : "bullet"} />
                  <div style={{ fontWeight: 800 }}>
                    {t.title}
                    {t.dueDate ? <span className="muted"> • {t.dueDate}</span> : null}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn" onClick={() => toggleDone(t.id)}>
                    {t.done ? "Reopen" : "Done"}
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
  );
}
