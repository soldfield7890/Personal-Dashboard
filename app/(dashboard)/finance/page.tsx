"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { parseCsv, rowsToHoldings, Holding } from "@/app/components/finance/parseCsv";

function pickAdd200(holdings: Holding[]): { symbol?: string; reason: string } {
  if (!holdings.length) return { reason: "Upload a CSV to generate a suggestion." };

  // Phase 1 heuristic:
  // - Prefer holdings with highest score; tie-break by value
  const ranked = [...holdings]
    .filter((h) => h.symbol)
    .sort((a, b) => {
      const sa = a.score ?? 0;
      const sb = b.score ?? 0;
      if (sb !== sa) return sb - sa;
      return (b.value ?? 0) - (a.value ?? 0);
    });

  const top = ranked[0];
  return top?.symbol
    ? { symbol: top.symbol, reason: "Highest placeholder score (Phase 1). Replace with your scoring model next." }
    : { reason: "Could not detect symbols from CSV headers." };
}

export default function FinancePage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const totalValue = useMemo(() => {
    return holdings.reduce((sum, h) => sum + (h.value ?? 0), 0);
  }, [holdings]);

  const suggestion = useMemo(() => pickAdd200(holdings), [holdings]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Row 1 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Portfolio Summary">
          <p className="text-sm text-neutral-300">
            Total Value: <strong>${totalValue.toLocaleString()}</strong>
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Phase 1 from CSV upload {fileName ? `(${fileName})` : ""}
          </p>
        </Card>

        <Card title="Upload Holdings CSV">
          <input
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-neutral-300"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFileName(f.name);
              const text = await f.text();
              const { rows } = parseCsv(text);
              const hs = rowsToHoldings(rows);
              setHoldings(hs);
            }}
          />
          <p className="mt-2 text-xs text-neutral-500">
            Works with most brokerage exports. We’ll map headers more precisely next.
          </p>
        </Card>

        <Card title="Add $200 Suggestion">
          <p className="text-sm text-neutral-300">
            {suggestion.symbol ? (
              <>
                Add to: <strong>{suggestion.symbol}</strong>
              </>
            ) : (
              <strong>No suggestion yet</strong>
            )}
          </p>
          <p className="mt-2 text-xs text-neutral-500">{suggestion.reason}</p>
        </Card>
      </section>

      {/* Row 2 */}
      <section className="grid gap-4">
        <Card title="Holdings (Parsed)">
          {holdings.length === 0 ? (
            <p className="text-sm text-neutral-400">Upload a CSV to populate holdings.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-neutral-400">
                  <tr>
                    <th className="py-2 pr-4">Symbol</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Shares</th>
                    <th className="py-2 pr-4">Last</th>
                    <th className="py-2 pr-4">Value</th>
                    <th className="py-2 pr-4">Cost</th>
                    <th className="py-2 pr-4">Score</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-200">
                  {holdings.map((h) => (
                    <tr key={h.symbol} className="border-t border-neutral-800/60">
                      <td className="py-2 pr-4 font-semibold">{h.symbol}</td>
                      <td className="py-2 pr-4 text-neutral-400">{h.name ?? ""}</td>
                      <td className="py-2 pr-4">{h.shares ?? ""}</td>
                      <td className="py-2 pr-4">{h.lastPrice ?? ""}</td>
                      <td className="py-2 pr-4">{h.value ?? ""}</td>
                      <td className="py-2 pr-4">{h.costBasis ?? ""}</td>
                      <td className="py-2 pr-4">{h.score ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      {/* Row 3 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Scoring Model Stub">
          <p className="text-xs text-neutral-500">
            Next: replace placeholder score with your real model (durability, growth, valuation, macro fit, risk).
          </p>
        </Card>

        <Card title="AI Finance Assistant">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500"
            placeholder={`Ask Finance AI:\n- "Where am I overexposed?"\n- "What should I trim?"\n- "Rank my holdings by score"`}
          />
        </Card>

        <Card title="Charts (Coming Soon)">
          <p className="text-xs text-neutral-500">
            Performance + allocation charts will go here after data mapping is finalized.
          </p>
        </Card>
      </section>
    </div>
  );
}
