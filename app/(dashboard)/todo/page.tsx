"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { useTasks, TaskPriority } from "@/app/components/state/TaskStore";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TodoPage() {
  const { tasks, addTask, toggleDone, removeTask, updateTask, criticalTodayCount } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [dueDate, setDueDate] = useState<string>(todayISO());
  const [filter, setFilter] = useState<"open" | "all" | "done" | "today">("open");

  const filtered = useMemo(() => {
    const t0 = todayISO();
    return tasks.filter((t) => {
      if (filter === "all") return true;
      if (filter === "done") return t.done;
      if (filter === "today") return !t.done && t.dueDate === t0;
      return !t.done;
    });
  }, [tasks, filter]);

  const add = () => {
    const t = title.trim();
    if (!t) return;
    addTask({ title: t, priority, dueDate });
    setTitle("");
    setPriority("normal");
    setDueDate(todayISO());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Add Task" className={criticalTodayCount > 0 ? "tile-critical" : ""}>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
              placeholder="Task title…"
            />

            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-neutral-400">
                Priority
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-sm text-neutral-100"
                >
                  <option value="low">low</option>
                  <option value="normal">normal</option>
                  <option value="high">high</option>
                  <option value="critical">critical</option>
                </select>
              </label>

              <label className="text-xs text-neutral-400">
                Due
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2 text-sm text-neutral-100"
                />
              </label>
            </div>

            <button className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black">
              Add Task
            </button>

            {criticalTodayCount > 0 && (
              <p className="text-xs text-emerald-300">
                {criticalTodayCount} critical task(s) due today.
              </p>
            )}
          </form>
        </Card>

        <Card title="Filters">
          <div className="flex flex-wrap gap-2">
            {(["open", "today", "done", "all"] as const).map((k) => (
              <button
                key={k}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  filter === k
                    ? "border-emerald-500 text-emerald-300"
                    : "border-neutral-700 text-neutral-300"
                }`}
                onClick={() => setFilter(k)}
                type="button"
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Summary">
          <div className="space-y-1 text-sm text-neutral-300">
            <div>Total: {tasks.length}</div>
            <div>Open: {tasks.filter((t) => !t.done).length}</div>
            <div>Done: {tasks.filter((t) => t.done).length}</div>
          </div>
        </Card>
      </section>

      <section>
        <Card title="Tasks">
          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">No tasks for this view.</p>
          ) : (
            <div className="divide-y divide-neutral-800/60">
              {filtered.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-sm ${t.done ? "text-neutral-500 line-through" : "text-neutral-100"}`}>
                      {t.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {t.priority}{t.dueDate ? ` • due ${t.dueDate}` : ""}
                    </div>
                  </div>

                  <select
                    value={t.priority}
                    onChange={(e) => updateTask(t.id, { priority: e.target.value as TaskPriority })}
                    className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200"
                  >
                    <option value="low">low</option>
                    <option value="normal">normal</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>

                  <button
                    type="button"
                    className="rounded-lg border border-neutral-700 px-2 py-1 text-xs text-neutral-300"
                    onClick={() => removeTask(t.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
