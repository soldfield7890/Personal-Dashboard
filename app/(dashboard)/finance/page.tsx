"use client";

import { Card } from "@/app/components/ui/Card";

export default function FinancePage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Row 1 */}
      <Card title="Portfolio Summary">
        <p>Total Value: $XXX,XXX</p>
        <p className="text-neutral-400 text-xs">
          Long-term + active accounts
        </p>
      </Card>

      <Card title="Allocation">
        <ul className="space-y-1">
          <li>Equities: 65%</li>
          <li>ETFs / Funds: 20%</li>
          <li>Cash: 10%</li>
          <li>Crypto: 5%</li>
        </ul>
      </Card>

      <Card title="Cash / Dry Powder">
        <p>Available Cash: $XX,XXX</p>
        <p className="text-xs text-neutral-400">
          Ready for pullbacks / adds
        </p>
      </Card>

      {/* Row 2 */}
      <Card title="Watchlist">
        <ul className="space-y-1">
          <li>MSFT — Core AI</li>
          <li>GOOG — Search + AI infra</li>
          <li>RTX — Defense</li>
          <li>DUK — Utilities</li>
        </ul>
      </Card>

      <Card title="Top Movers">
        <ul className="space-y-1">
          <li className="text-emerald-400">MSFT +1.4%</li>
          <li className="text-emerald-400">GOOG +0.9%</li>
          <li className="text-red-400">RTX −0.6%</li>
        </ul>
      </Card>

      <Card title="Risk / Exposure">
        <ul className="space-y-1 text-sm">
          <li>AI / Tech: High</li>
          <li>Defense: Medium</li>
          <li>Energy: Medium</li>
          <li>International: Low</li>
        </ul>
      </Card>

      {/* Row 3 */}
      <Card title="Strategy Notes" className="lg:col-span-2">
        <p>
          Maintain core positions. Add on quality pullbacks.
          Prioritize AI leaders.
        </p>
      </Card>

      <Card title="AI Finance Assistant">
        <textarea
          rows={4}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
          placeholder={`Ask Finance AI:\n- Where am I overexposed?\n- What should I add on a dip?\n- Summarize my risk profile`}
        />
      </Card>
    </div>
  );
}
