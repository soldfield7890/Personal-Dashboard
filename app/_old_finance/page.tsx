"use client";

import { useEffect, useMemo, useState } from "react";

type ApiOk = {
    ok: true;
    meta: {
        folderId: string;
        schwab: { file: string; modifiedTime?: string; rowCount: number };
        fidelity: { file: string; modifiedTime?: string; rowCount: number };
    };
    raw: {
        schwabRows: Record<string, string>[];
        fidelityRows: Record<string, string>[];
    };
};

type ApiErr = {
    ok: false;
    error: string;
    found?: string[];
};

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ApiOk | null>(null);
    const [err, setErr] = useState<ApiErr | null>(null);

    useEffect(() => {
        let alive = true;

        async function run() {
            setLoading(true);
            setErr(null);
            setData(null);

            try {
                const res = await fetch("/api/portfolio", { cache: "no-store" });
                const json = (await res.json()) as ApiOk | ApiErr;

                if (!alive) return;

                if (!res.ok || (json as any).ok === false) {
                    setErr(json as ApiErr);
                } else {
                    setData(json as ApiOk);
                }
            } catch (e: any) {
                if (!alive) return;
                setErr({ ok: false, error: e?.message ?? "Unknown error" });
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }

        run();
        return () => {
            alive = false;
        };
    }, []);

    const totals = useMemo(() => {
        // Phase 1: just show counts + filenames.
        // (Phase 2 will normalize + compute totals.)
        if (!data) return null;
        return {
            schwabCount: data.meta.schwab.rowCount,
            fidelityCount: data.meta.fidelity.rowCount,
            totalRows: data.meta.schwab.rowCount + data.meta.fidelity.rowCount,
        };
    }, [data]);

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <div className="kicker">FINANCE / STOCKS</div>
                    <h1 className="headline">Portfolio ingestion</h1>
                    <div className="subhead">
                        Phase 1: load latest Schwab + Fidelity CSVs from Google Drive (service account).
                    </div>
                </div>

                <div className="pill">
                    API: <span className="mono">/api/portfolio</span>
                </div>
            </div>

            <section className="grid-finance">
                <div className="tile tile-finance">
                    <div className="tile-title">Status</div>

                    {loading && (
                        <div className="callout">
                            <div className="callout-title">Loading…</div>
                            <div className="callout-body">Fetching the latest CSVs from Drive.</div>
                        </div>
                    )}

                    {!loading && err && (
                        <div className="callout callout-error">
                            <div className="callout-title">ERROR</div>
                            <div className="callout-body">{err.error}</div>
                            {!!err.found?.length && (
                                <div className="callout-body muted" style={{ marginTop: 10 }}>
                                    Found in folder:
                                    <ul className="list">
                                        {err.found.slice(0, 10).map((n) => (
                                            <li key={n}>{n}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="callout-body muted" style={{ marginTop: 10 }}>
                                Required filenames:
                                <div className="mono">schwab_holdings_YYYY-MM-DD.csv</div>
                                <div className="mono">fidelity_holdings_YYYY-MM-DD.csv</div>
                            </div>
                        </div>
                    )}

                    {!loading && data && totals && (
                        <div className="stack">
                            <div className="callout callout-ok">
                                <div className="callout-title">OK</div>
                                <div className="callout-body">Drive ingestion is working.</div>
                            </div>

                            <div className="row2">
                                <div className="metric">
                                    <div className="metric-label">Schwab rows</div>
                                    <div className="metric-value">{totals.schwabCount}</div>
                                    <div className="metric-sub mono">{data.meta.schwab.file}</div>
                                </div>
                                <div className="metric">
                                    <div className="metric-label">Fidelity rows</div>
                                    <div className="metric-value">{totals.fidelityCount}</div>
                                    <div className="metric-sub mono">{data.meta.fidelity.file}</div>
                                </div>
                            </div>

                            <div className="tile-divider" />

                            <div className="muted">
                                Next: Phase 2 will normalize both brokers into one schema + compute totals and KPIs.
                            </div>
                        </div>
                    )}
                </div>

                <div className="tile tile-finance">
                    <div className="tile-title">What to do if it fails</div>
                    <ul className="list">
                        <li>
                            Confirm <span className="mono">.env.local</span> has the 3 vars and you restarted dev server.
                        </li>
                        <li>
                            Share the Drive folder to the <span className="mono">service account email</span> as Viewer.
                        </li>
                        <li>
                            Ensure filenames match exactly:
                            <div className="mono">schwab_holdings_YYYY-MM-DD.csv</div>
                            <div className="mono">fidelity_holdings_YYYY-MM-DD.csv</div>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
