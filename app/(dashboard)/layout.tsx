"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TaskProvider } from "@/app/components/state/TaskStore";

const NAV = [
  { href: "/today", label: "Today" },
  { href: "/finance", label: "Finance" },
  { href: "/todo", label: "To-Do" },
];

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""}`}>
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TaskProvider>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="brand">
              <div className="brand-logo">
                <Image
                  src="/oldfield-logo.png.jpg"
                  alt="SEO Life OS"
                  width={28}
                  height={28}
                  priority
                />
              </div>
              <div className="brand-title">SEO Life OS</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </aside>

        <main className="content">{children}</main>
      </div>
    </TaskProvider>
  );
}
