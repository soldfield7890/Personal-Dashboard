"use client";

import React from "react";

type CardProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
};

export function Card({ className = "", title, subtitle, right, children }: CardProps) {
  return (
    <section className={`tile ${className}`}>
      {(title || subtitle || right) && (
        <div className="tileHeader">
          <div className="tileTitleBlock">
            {title ? <div className="tileTitle">{title}</div> : null}
            {subtitle ? <div className="tileSubtitle">{subtitle}</div> : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      )}
      <div className="tileBody">{children}</div>
    </section>
  );
}
