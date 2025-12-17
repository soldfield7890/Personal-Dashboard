"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TaskStatus = "open" | "done";
export type TaskPriority = 1 | 2 | 3; // 1=critical, 2=normal, 3=low

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
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearDone: () => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);

const STORAGE_KEY = "seo-lifeos.tasks.v1";

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

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      // ignore
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
      // ignore
    }
  }, [tasks, hydrated]);

  const value = useMemo<TaskContextValue>(() => {
    return {
      tasks,
      addTask: (title, priority = 2, dueInDays = 0) => {
        const trimmed = title.trim();
        if (!trimmed) return;

        const now = new Date();
        const dueDate = dueInDays > 0 ? yyyyMmDd(addDays(now, dueInDays)) : undefined;

        const t: Task = {
          id: crypto.randomUUID(),
          title: trimmed,
          status: "open",
          priority,
          dueDate,
          createdAt: now.toISOString(),
        };

        setTasks((prev) => [t, ...prev]);
      },
      toggleTask: (id) => {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t))
        );
      },
      removeTask: (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      },
      clearDone: () => {
        setTasks((prev) => prev.filter((t) => t.status !== "done"));
      },
    };
  }, [tasks]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
