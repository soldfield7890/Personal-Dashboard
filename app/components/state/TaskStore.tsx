"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from "react";

/**
 * Task priority:
 * 1 = High / Critical
 * 2 = Normal
 * 3 = Low
 */
export type TaskPriority = 1 | 2 | 3;

export type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: TaskPriority;

  // Optional metadata (safe for future enhancements)
  dueDate?: string; // ISO date string (YYYY-MM-DD) or full ISO
  createdAt: string; // ISO datetime
  updatedAt?: string; // ISO datetime
  notes?: string;
  tags?: string[];
};

export const seedTasks: Task[] = [
  {
    id: "seed-1",
    title: "Review dashboard UI polish plan",
    done: false,
    priority: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Fix build errors before UI iteration",
    done: true,
    priority: 1,
    createdAt: new Date().toISOString(),
  },
];

type AddTaskInput =
  | {
      title: string;
      priority?: TaskPriority;
      dueDate?: string;
      notes?: string;
      tags?: string[];
    }
  // Support older call style: addTask(title, priority?, dueDate?)
  | string;

type TaskUpdatePatch = Partial<
  Pick<Task, "title" | "done" | "priority" | "dueDate" | "notes" | "tags">
>;

export type TaskContextValue = {
  tasks: Task[];

  // Core actions
  addTask: (input: AddTaskInput, priority?: TaskPriority, dueDate?: string) => void;
  removeTask: (id: string) => void;

  // ✅ This is what your To-Do page expects
  toggleDone: (id: string) => void;

  // Useful actions for UI polish & future enhancements
  updateTask: (id: string, patch: TaskUpdatePatch) => void;
  setPriority: (id: string, priority: TaskPriority) => void;
  setTitle: (id: string, title: string) => void;
  setDueDate: (id: string, dueDate?: string) => void;

  // Derived metrics (optional but handy)
  criticalCount: number;
  openCount: number;
  doneCount: number;
};

const TaskContext = createContext<TaskContextValue | null>(null);

function uid(prefix = "t") {
  // small, deterministic-enough id generator for UI use
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeDueDate(input?: string) {
  if (!input) return undefined;
  // If a full ISO string, keep it; if YYYY-MM-DD, keep it as-is.
  return input.trim();
}

export function TaskProvider({
  children,
  initialTasks,
}: {
  children: ReactNode;
  initialTasks?: Task[];
}) {
  // Keep stable defaults and avoid "undefined tasks" pitfalls
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (Array.isArray(initialTasks) && initialTasks.length) return initialTasks;
    return [];
  });

  const addTask = useCallback<
    TaskContextValue["addTask"]
  >((input: AddTaskInput, priority?: TaskPriority, dueDate?: string) => {
    // Support both styles:
    // - addTask({ title, priority, dueDate })
    // - addTask("title", 2, "2025-12-19")
    const now = new Date().toISOString();

    let title: string;
    let pr: TaskPriority = 2;
    let dd: string | undefined;
    let notes: string | undefined;
    let tags: string[] | undefined;

    if (typeof input === "string") {
      title = input;
      if (priority) pr = priority;
      dd = normalizeDueDate(dueDate);
    } else {
      title = input.title;
      pr = input.priority ?? 2;
      dd = normalizeDueDate(input.dueDate);
      notes = input.notes;
      tags = input.tags;
    }

    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: uid("task"),
      title: trimmed,
      done: false,
      priority: pr,
      dueDate: dd,
      createdAt: now,
      updatedAt: now,
      notes,
      tags,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDone = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done, updatedAt: now } : t))
    );
  }, []);

  const updateTask = useCallback((id: string, patch: TaskUpdatePatch) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          ...patch,
          dueDate: patch.dueDate ? normalizeDueDate(patch.dueDate) : patch.dueDate,
          updatedAt: now,
        };
      })
    );
  }, []);

  const setPriority = useCallback((id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  }, [updateTask]);

  const setTitle = useCallback((id: string, title: string) => {
    updateTask(id, { title: title.trim() });
  }, [updateTask]);

  const setDueDate = useCallback((id: string, dueDate?: string) => {
    updateTask(id, { dueDate: dueDate ? normalizeDueDate(dueDate) : undefined });
  }, [updateTask]);

  const derived = useMemo(() => {
    const open = tasks.filter((t) => !t.done);
    const done = tasks.filter((t) => t.done);

    // "critical" = priority 1 and not done
    const criticalCount = open.filter((t) => t.priority === 1).length;

    return {
      openCount: open.length,
      doneCount: done.length,
      criticalCount,
    };
  }, [tasks]);

  const value: TaskContextValue = useMemo(
    () => ({
      tasks,
      addTask,
      removeTask,
      toggleDone,
      updateTask,
      setPriority,
      setTitle,
      setDueDate,
      ...derived,
    }),
    [tasks, addTask, removeTask, toggleDone, updateTask, setPriority, setTitle, setDueDate, derived]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks must be used within <TaskProvider />");
  }
  return ctx;
}

/**
 * Optional helper: determine if a task is due today (YYYY-MM-DD).
 * Useful for “critical today” highlighting in UI.
 */
export function isDueToday(task: Task) {
  if (!task.dueDate) return false;
  const due = task.dueDate.slice(0, 10);
  return due === todayISODate();
}
