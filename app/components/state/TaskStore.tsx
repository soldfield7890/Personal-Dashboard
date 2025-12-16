"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TaskPriority = "low" | "normal" | "high" | "critical";

export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  domain?: string; // Personal / MART / CGGC / Home / etc.
  done: boolean;
  createdAt: string; // ISO
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (input: { title: string; priority?: TaskPriority; dueDate?: string; domain?: string }) => void;
  toggleDone: (id: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  criticalTodayCount: number;
};

const STORAGE_KEY = "seo-lifeos.tasks.v1";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function uid(): string {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) setTasks(parsed);
    } catch {
      // ignore
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const addTask: TaskContextValue["addTask"] = (input) => {
    const title = (input.title || "").trim();
    if (!title) return;

    const t: Task = {
      id: uid(),
      title,
      priority: input.priority ?? "normal",
      dueDate: input.dueDate,
      domain: input.domain,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [t, ...prev]);
  };

  const toggleDone: TaskContextValue["toggleDone"] = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTask: TaskContextValue["removeTask"] = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask: TaskContextValue["updateTask"] = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id == id ? { ...t, ...patch } : t)));
  };

  const criticalTodayCount = useMemo(() => {
    const t0 = todayISO();
    return tasks.filter((t) => !t.done && t.priority === "critical" && t.dueDate === t0).length
  }, [tasks]);

  const value = useMemo(
    () => ({ tasks, addTask, toggleDone, removeTask, updateTask, criticalTodayCount }),
    [tasks, criticalTodayCount]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
