"use client";

import { Card } from "@/app/components/ui/Card";

export default function TodayPage() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Personal Command Center">
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-400">Today • {today}</span>
          <span className="font-semibold">Good afternoon, Stephen</span>
          <span className="text-neutral-500">
            3 meetings · 7 tasks · 41°F (sample)
          </span>
        </div>
      </Card>

      <Card title="Next 3 Events">
        <div className="text-sm text-neutral-300 leading-relaxed">
          2:00 PM — HST Call Review
          <br />
          3:00 PM — Exec Touchpoint
          <br />
          5:30 PM — Family Dinner
        </div>
      </Card>


      <Card title="Quick Capture">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="h-9 flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Add task or note…"
          />
          <button
            type="submit"
            className="h-9 rounded-xl bg-emerald-500 px-3 text-xs font-semibold text-black hover:bg-emerald-400"
          >
            Add
          </button>
        </form>
      </Card>

    </div>
  );
}
