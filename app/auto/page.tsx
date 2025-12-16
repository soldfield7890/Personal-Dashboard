// app/auto/page.tsx
export default function AutoPage() {
    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">Auto • SEO Command Center</div>
                    <div className="page-title">Vehicles & Maintenance</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            2019 F-150 • 2016 Edge • 2019 JD 1025R (300 hrs).
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile tile-briefing">
                <div className="tile-header">
                    <span>Maintenance Log</span>
                    <span className="page-pill">We&apos;ll build full tables next.</span>
                </div>
                <div className="tile-body">
                    This will track oil changes, tires, inspections, major repairs and
                    reminders for each vehicle.
                </div>
            </section>
        </>
    );
}
