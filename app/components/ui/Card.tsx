"use client";

import React from "react";

export function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "h-full rounded-2xl border border-neutral-800/60 bg-neutral-950/70 p-4 shadow-md backdrop-blur " +
        className
      }
    >
      <header className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          {title}
        </h2>
      </header>
      <div className="text-sm text-neutral-100">{children}</div>
    </section>
  );
}
