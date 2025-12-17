"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image
              src="/oldfield-logo.png.jpg"
              alt="Oldfield logo"
              width={26}
              height={26}
              style={{ borderRadius: 8 }}
              priority
            />
            <div className="brand">SEO Life OS</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </aside>

      <main className="main">
        <div className="topbar" />
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
