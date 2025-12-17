"use client";

import type { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Card({ title, subtitle, right, className = "", children }: CardProps) {
  return (
    <section className={`tile ${className}`}>
      <div className="tileHeader">
        <div>
          <div className="tileKicker">{title}</div>
          {subtitle ? <div className="tileTitle">{subtitle}</div> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </section>
  );
}
