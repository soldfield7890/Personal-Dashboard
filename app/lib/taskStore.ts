"use client";

import { useEffect, useSyncExternalStore } from "react";

export type TaskPriority = 1 | 2 | 3; // 1=Critical, 2=Normal, 3=Low
export type TaskStatus = "open" | "done";

export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  due: string | null;
  createdAt: number;
};

type StoreState = {
  tasks: Task[];
};

type StoreApi = {
  getState: () => StoreState;
  subscribe: (listener: () => void) => () => void;
  addTask: (title: string, priority?: TaskPriority, due?: string | null) => void;
  toggleDone: (id: string) => void;
  removeTask: (id: string) => void;
  clearDone: () => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  hydrateFromStorage: () => void;
};

const STORAGE_KEY = "seo-lifeos.tasks.v1";

const listeners = new Set<() => void>();

let state: StoreState = { tasks: [] };
let hydrated = false;

function emit() {
  for (const l of listeners) l();
}

function safeParse(json: string | null): Task[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t) => t && typeof t.id === "string" && typeof t.title === "string")
      .map((t) => ({
        id: String(t.id),
        title: String(t.title),
        priority: (Number(t.priority) as TaskPriority) || 2,
        status: (t.status === "done" ? "done" : "open") as TaskStatus,
        due: typeof t.due === "string" ? t.due : null,
        createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function setState(next: StoreState) {
  state = next;
  saveToStorage();
  emit();
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

const api: StoreApi = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  hydrateFromStorage: () => {
    if (hydrated) return;
    if (typeof window === "undefined") return;
    hydrated = true;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = { tasks: safeParse(raw) };
    emit();
  },

  addTask: (title, priority = 2, due = null) => {
    const trimmed = (title || "").trim();
    if (!trimmed) return;

    const task: Task = {
      id: uid(),
      title: trimmed,
      priority,
      status: "open",
      due,
      createdAt: Date.now(),
    };

    setState({ tasks: [task, ...state.tasks] });
  },

  toggleDone: (id) => {
    setState({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "open" : "done" } : t
      ),
    });
  },

  removeTask: (id) => {
    setState({ tasks: state.tasks.filter((t) => t.id !== id) });
  },

  clearDone: () => {
    setState({ tasks: state.tasks.filter((t) => t.status !== "done") });
  },

  updateTask: (id, patch) => {
    setState({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  },
};

export function useTaskStore() {
  // Important: server snapshot == client snapshot on first render (empty),
  // then we hydrate AFTER mount to avoid hydration mismatch.
  const snapshot = useSyncExternalStore(api.subscribe, api.getState, api.getState);

  useEffect(() => {
    api.hydrateFromStorage();
  }, []);

  return {
    tasks: snapshot.tasks,
    addTask: api.addTask,
    toggleDone: api.toggleDone,
    removeTask: api.removeTask,
    clearDone: api.clearDone,
    updateTask: api.updateTask,
  };
}
