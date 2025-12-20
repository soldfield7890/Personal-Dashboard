// app/todo/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    TASKS_STORAGE_KEY,
    Task,
    TaskPriority,
    seedTasks,
} from "../data/tasks";

export default function TodoPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("normal");

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(TASKS_STORAGE_KEY);
            if (stored) {
                setTasks(JSON.parse(stored));
            } else {
                setTasks(seedTasks);
            }
        } catch {
            setTasks(seedTasks);
        }
    }, []);

    const save = (next: Task[]) => {
        setTasks(next);
        try {
            window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const openTasks = tasks.filter((t) => t.status === "open");
    const doneTasks = tasks.filter((t) => t.status === "done");

    const criticalToday = useMemo(
        () => openTasks.filter((t) => t.priority === "critical"),
        [openTasks]
    );
    const highPriority = useMemo(
        () => openTasks.filter((t) => t.priority === "high"),
        [openTasks]
    );
    const normalPriority = useMemo(
        () => openTasks.filter((t) => t.priority === "normal"),
        [openTasks]
    );

    function addTask() {
        if (!title.trim()) return;
        const next: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            priority,
            status: "open",
        };
        const updated = [next, ...tasks];
        save(updated);
        setTitle("");
        setPriority("normal");
    }

    function toggleDone(id: string) {
        const updated = tasks.map((t) =>
            t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t
        );
        save(updated);
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">To-Do • SEO Command Center</div>
                    <div className="page-title">Tasks & Projects</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Open: {openTasks.length} • Done: {doneTasks.length}
                        </span>
                        {criticalToday.length > 0 && (
                            <span className="page-pill page-pill--accent">
                                {criticalToday.length} critical today
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <section className="tile tile-briefing">
                <div className="tile-header">
                    <span>Capture</span>
                    <span className="page-pill">
                        Simple local-first task list. Later: sync + AI.
                    </span>
                </div>
                <div className="tile-body">
                    <div className="input-inline">
                        <input
                            placeholder="New task…"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                        <button className="btn-pill btn-pill--primary" onClick={addTask}>
                            Add
                        </button>
                    </div>
                </div>
            </section>

            <section className="tile tile-calendar" style={{ marginTop: 16 }}>
                <div className="tile-header">
                    <span>Board</span>
                    <span className="page-pill">
                        Critical • High • Normal – Kanban-style.
                    </span>
                </div>
                <div className="tile-body">
                    <div className="todo-columns">
                        <div>
                            <div className="todo-column-title">Critical</div>
                            {criticalToday.map((t) => (
                                <div
                                    key={t.id}
                                    className="todo-card todo-card-critical"
                                    onClick={() => toggleDone(t.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {t.title}
                                </div>
                            ))}
                            {criticalToday.length === 0 && (
                                <div className="todo-card">No critical items today.</div>
                            )}
                        </div>
                        <div>
                            <div className="todo-column-title">High</div>
                            {highPriority.map((t) => (
                                <div
                                    key={t.id}
                                    className="todo-card"
                                    onClick={() => toggleDone(t.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {t.title}
                                </div>
                            ))}
                            {highPriority.length === 0 && (
                                <div className="todo-card">No high-priority items.</div>
                            )}
                        </div>
                        <div>
                            <div className="todo-column-title">Normal</div>
                            {normalPriority.map((t) => (
                                <div
                                    key={t.id}
                                    className="todo-card"
                                    onClick={() => toggleDone(t.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {t.title}
                                </div>
                            ))}
                            {normalPriority.length === 0 && (
                                <div className="todo-card">Parking lot is clear.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
