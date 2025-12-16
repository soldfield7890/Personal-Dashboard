"use client";

import { Card } from "@/app/components/ui/Card";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      {/* ───────────── Row 1 ───────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Portfolio Summary">
          <p className="text-sm text-neutral-300">
            Total Value: <strong>$XXX,XXX</strong>
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Long-term + Active accounts
          </p>
        </Card>

        <Card title="Allocation">
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>Equities: 65%</li>
            <li>ETFs / Funds: 20%</li>
            <li>Cash: 10%</li>
            <li>Crypto: 5%</li>
          </ul>
        </Card>

        <Card title="Cash / Dry Powder">
          <p className="text-sm text-neutral-300">
            Available Cash: <strong>$XX,XXX</strong>
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Ready for pullbacks / adds
          </p>
        </Card>
      </section>

      {/* ───────────── Row 2 ───────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Watchlist">
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>MSFT — Core AI</li>
            <li>GOOG — Search + AI infra</li>
            <li>RTX — Defense</li>
            <li>DUK — Utilities</li>
          </ul>
        </Card>

        <Card title="Top Movers">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>MSFT</span>
              <span className="text-emerald-400">+1.4%</span>
            </div>
            <div className="flex justify-between">
              <span>GOOG</span>
              <span className="text-emerald-400">+0.9%</span>
            </div>
            <div className="flex justify-between">
              <span>RTX</span>
              <span className="text-red-400">-0.6%</span>
            </div>
          </div>
        </Card>

        <Card title="Risk / Exposure">
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>AI / Tech: High</li>
            <li>Defense: Medium</li>
            <li>Energy: Medium</li>
            <li>International: Low</li>
          </ul>
        </Card>
      </section>

      {/* ───────────── Row 3 ───────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Strategy Notes">
          <p className="text-sm text-neutral-300">
            Maintain core positions. Add on quality pullbacks.
            Prioritize AI.
          </p>
        </Card>

        <Card title="AI Finance Assistant">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
            placeholder={`Ask Finance AI:
- "Where am I overexposed?"
- "What should I add on a dip?"
- "Summarize my risk profile"`}
          />
        </Card>

        <Card title="Charts (Coming Soon)">
          <p className="text-xs text-neutral-400">
            Performance, allocation & trend charts will live here.
          </p>
        </Card>
      </section>
    </div>
  );
}
