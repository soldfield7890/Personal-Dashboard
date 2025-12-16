"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { TaskProvider } from "@/app/components/state/TaskStore";

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/finance", label: "Finance" },
  { href: "/todo", label: "To-Do" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""}`}>
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TaskProvider>
      <div className="app-shell">
        <aside className="sidebar" data-open={sidebarOpen ? "true" : "false"}>
          <div className="sidebar-header">
            <div className="brand">SEO Life OS</div>
          </div>

          <nav className="nav" onClick={() => setSidebarOpen(false)}>
            {NAV.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </aside>

        <main className="main">
          <div className="topbar">
            <button
              className="sidebar-toggle"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              ☰
            </button>
          </div>

          <div className="content px-4 py-4">{children}</div>
        </main>
      </div>
    </TaskProvider>
  );
}
