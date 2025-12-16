// app/components/Sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Today", icon: "☀️" },
  { href: "/finance", label: "Finance / Stocks", icon: "📈" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/weather", label: "Weather", icon: "🌤️" },
  { href: "/todo", label: "To-Do", icon: "✅" },
  { href: "/auto", label: "Auto", icon: "🚙" },
  { href: "/garden", label: "Garden", icon: "🌱" },
  { href: "/workshop", label: "Woodworking & Workshop", icon: "🪚" },
  { href: "/journal", label: "Journal", icon: "📝" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-card">
        <div className="sidebar-logo-row">
          <div className="sidebar-logo-circle">
            <Image
              src="/oldfield-logo.png"
              alt="Oldfield family logo"
              fill
              sizes="48px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-title">SEO Command Center</div>
            <div className="sidebar-logo-subtitle">Stephen&apos;s Personal OS</div>
            <div className="sidebar-logo-meta">Today • {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "sidebar-nav-item" + (active ? " sidebar-nav-item--active" : "")
              }
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
