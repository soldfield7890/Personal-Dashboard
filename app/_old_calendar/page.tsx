// app/calendar/page.tsx
export default function CalendarPage() {
    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">Calendar • SEO Command Center</div>
                    <div className="page-title">Calendar Hub</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Phase 2: Google Calendar sync + AI time-blocking.
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile tile-calendar">
                <div className="tile-header">
                    <span>Placeholder</span>
                    <span className="page-pill">
                        We&apos;ll wire real calendar UI and sync next.
                    </span>
                </div>
                <div className="tile-body">
                    This will become the full month/week/day planning canvas.
                </div>
            </section>
        </>
    );
}
