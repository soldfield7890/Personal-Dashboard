// app/workshop/page.tsx
export default function WorkshopPage() {
    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">
                        Woodworking & Workshop • SEO Command Center
                    </div>
                    <div className="page-title">Shop Projects & Inventory</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Project queue, materials, tools, jigs – all in one spot.
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile tile-briefing">
                <div className="tile-header">
                    <span>Next Builds</span>
                    <span className="page-pill">
                        We&apos;ll wire actual project cards and cut lists next.
                    </span>
                </div>
                <div className="tile-body">
                    This is where keepsake boxes, jigs, and shop upgrades will live.
                </div>
            </section>
        </>
    );
}
