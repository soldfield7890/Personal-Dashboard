"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/* =========================
   Types
========================= */

export type TaskStatus = "open" | "done";
export type TaskPriority = 1 | 2 | 3; // 1=Critical, 2=Normal, 3=Low

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (title: string, priority?: TaskPriority, dueInDays?: number) => void;

  // canonical name
  toggleTask: (id: string) => void;

  // backwards-compatible alias (older pages may call this)
  toggleDone: (id: string) => void;

  removeTask: (id: string) => void;
  clearDone: () => void;

  // derived helpers (handy for Today page)
  criticalTodayCount: number;
};

/* =========================
   Context
========================= */

const TaskContext = createContext<TaskContextValue | null>(null);
const STORAGE_KEY = "seo-lifeos.tasks.v1";

/* =========================
   Helpers
========================= */

function yyyyMmDd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/* =========================
   Provider
========================= */

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      /* noop */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist (client only)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* noop */
    }
  }, [tasks, hydrated]);

  const criticalTodayCount = useMemo(() => {
    const today = yyyyMmDd(new Date());
    return tasks.filter((t) => t.status !== "done" && t.priority === 1 && t.dueDate === today).length;
  }, [tasks]);

  const value = useMemo<TaskContextValue>(() => {
    const toggle = (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t))
      );
    };

    return {
      tasks,

      addTask: (title, priority = 2, dueInDays = 0) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        const now = new Date();
        const dueDate = dueInDays > 0 ? yyyyMmDd(addDays(now, dueInDays)) : undefined;

        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

        const t: Task = {
          id,
          title: trimmed,
          status: "open",
          priority,
          dueDate,
          createdAt: now.toISOString(),
        };

        setTasks((prev) => [t, ...prev]);
      },

      toggleTask: toggle,
      toggleDone: toggle,

      removeTask: (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      },

      clearDone: () => {
        setTasks((prev) => prev.filter((t) => t.status !== "done"));
      },

      criticalTodayCount,
    };
  }, [tasks, criticalTodayCount]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/* =========================
   Hook
========================= */

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
