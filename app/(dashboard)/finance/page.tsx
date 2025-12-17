"use client";

import { Card } from "@/app/components/ui/Card";

export default function FinancePage() {
  return (
    <div className="dash">
      <div className="grid-3">
        <Card title="PORTFOLIO SUMMARY" subtitle="Phase 1 from CSV upload">
          <div style={{ fontWeight: 700 }}>Total Value: $0</div>
        </Card>

        <Card title="UPLOAD HOLDINGS CSV" subtitle="Works with most brokerage exports. We'll map headers more precisely next.">
          <input className="input" type="file" accept=".csv" />
        </Card>

        <Card title="BUY / ADD SUGGESTION" subtitle="Based on holdings + scoring + market conditions (later)">
          <div style={{ fontWeight: 600 }}>No suggestion yet</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Upload a CSV to generate a suggestion.
          </div>
        </Card>
      </div>

      <div className="grid-3" style={{ marginTop: 18 }}>
        <Card title="HOLDINGS (PARSED)">
          <div className="muted">Upload a CSV to populate holdings.</div>
        </Card>

        <Card title="SCORING MODEL STUB">
          <div className="muted">
            Next: replace placeholder score with your real model (durability, growth, valuation, macro fit, risk).
          </div>
        </Card>

        <Card title="AI FINANCE ASSISTANT">
          <textarea
            className="textarea"
            placeholder={`Ask Finance AI:\n- "Where am I overexposed?"\n- "What should I trim?"\n- "Rank my holdings by score"`}
          />
        </Card>
      </div>

      <div className="grid-3" style={{ marginTop: 18 }}>
        <Card title="CHARTS (COMING SOON)">
          <div className="muted">Performance + allocation charts will live here after data mapping is finalized.</div>
        </Card>
      </div>
    </div>
  );
}
