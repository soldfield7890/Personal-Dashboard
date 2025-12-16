// app/weather/page.tsx
"use client";

export default function WeatherPage() {
    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">Weather • SEO Command Center</div>
                    <div className="page-title">Weather OS</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Phase 1: static. Phase 2: API + radar, hunt windows, clothing.
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile-grid">
                <div className="tile tile-weather">
                    <div className="tile-header">
                        <span>Today</span>
                        <span className="page-pill">Leominster, MA</span>
                    </div>
                    <div className="tile-body">
                        <p style={{ fontSize: 32, margin: "0 0 6px" }}>
                            28<span style={{ fontSize: 20 }}>°F</span>
                        </p>
                        <p>Clear, 9 mph (N)</p>
                        <p style={{ fontSize: 12, marginTop: 6 }}>
                            Clothing: insulated coat, mid-weight base, gloves, hat. Roads
                            fine; good for commute.
                        </p>
                    </div>
                </div>
                <div className="tile tile-briefing">
                    <div className="tile-header">
                        <span>Hunting / Outdoors Outlook</span>
                        <span className="page-pill">Next 3 days</span>
                    </div>
                    <div className="tile-body">
                        <ul className="tile-list">
                            <li>Day 1: stable high pressure, evening sit good, NW wind.</li>
                            <li>Day 2: pressure drop ahead of front – best movement.</li>
                            <li>Day 3: snow and wind – good track but low visibility.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
