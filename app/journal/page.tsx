// app/journal/page.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "seo_os_journal_today";

export default function JournalPage() {
    const [entry, setEntry] = useState("");

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) setEntry(stored);
        } catch {
            // ignore
        }
    }, []);

    function handleChange(value: string) {
        setEntry(value);
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // ignore
        }
    }

    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">Journal • SEO Command Center</div>
                    <div className="page-title">Men&apos;s Themes Journal</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Space for strategy, pressure, gratitude, next moves.
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile tile-briefing">
                <div className="tile-header">
                    <span>Daily Entry</span>
                    <span className="page-pill">
                        Saved locally on this browser. Later: sync + AI reflection.
                    </span>
                </div>
                <div className="tile-body">
                    <textarea
                        className="journal-textarea"
                        value={entry}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Dump the stack: wins, stress, moves, relationships, money, health. No filter."
                    />
                </div>
            </section>
        </>
    );
}
