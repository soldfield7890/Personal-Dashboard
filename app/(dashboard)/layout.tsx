"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""}`}>
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">SEO Life OS</div>
        </div>

        <nav className="nav">
          <NavLink href="/today" label="Today" />
          <NavLink href="/finance" label="Finance" />
          <NavLink href="/todo" label="To-Do" />
        </nav>
      </aside>

      <main className="main">
        <div className="topbar" />
        {/* consistent page padding + spacing for all dashboard pages */}
        <div className="content px-4 py-4">{children}</div>
      </main>
    </div>
  );
}
