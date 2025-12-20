"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: "☀️" },
  { href: "/finance", label: "Finance", icon: "📈" },
  { href: "/todo", label: "To-Do", icon: "✅" },
  { href: "/journal", label: "Journal", icon: "📝" },
  { href: "/auto", label: "Auto", icon: "🚙" },
  { href: "/garden", label: "Garden", icon: "🌱" },
  { href: "/workshop", label: "Workshop", icon: "🪚" },
];

function prettyDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Sidebar() {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    // normalize "/" -> "/today" if your app sometimes lands on "/"
    if (pathname === "/") return "/today";
    return pathname;
  }, [pathname]);

  return (
    <aside className="sb">
      <div className="sbTop">
        <div className="sbBrand">
          <div className="sbLogo">
            <Image
              src="/oldfield-logo.png"
              alt="Oldfield family logo"
              fill
              sizes="44px"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div className="sbBrandText">
            <div className="sbTitle">SEO Life OS</div>
            <div className="sbSub">TodayFinanceTo-Do</div>
            <div className="sbMeta">{prettyDate()}</div>
          </div>
        </div>
      </div>

      <nav className="sbNav" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/today"
              ? activeHref === "/today" || activeHref.startsWith("/today")
              : activeHref.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={"sbItem" + (active ? " sbItem--active" : "")}
            >
              <span className="sbIcon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="sbLabel">{item.label}</span>
              {active ? <span className="sbPip" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="sbBottom">
        <div className="sbStatus">
          <span className="sbDot" />
          <span>System: GREEN</span>
        </div>
      </div>
    </aside>
  );
}
