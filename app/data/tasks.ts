// app/data/tasks.ts

export type TaskPriority = "critical" | "high" | "normal";
export type TaskStatus = "open" | "done";

export interface Task {
    id: string;
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string; // ISO date string, optional
}

export const TASKS_STORAGE_KEY = "seo_os_tasks_v1";

export const seedTasks: Task[] = [
    {
        id: "1",
        title: "Finish MART performance review draft",
        priority: "critical",
        status: "open",
        dueDate: new Date().toISOString().slice(0, 10),
    },
    {
        id: "2",
        title: "Update Common Ground Grow Co. roadmap notes",
        priority: "high",
        status: "open",
    },
    {
        id: "3",
        title: "Block time for hunt / weekend planning",
        priority: "normal",
        status: "open",
    },
];
