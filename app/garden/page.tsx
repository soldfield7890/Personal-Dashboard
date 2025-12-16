// app/garden/page.tsx
export default function GardenPage() {
    return (
        <>
            <header className="page-header">
                <div className="page-header-main">
                    <div className="page-breadcrumb">Garden • SEO Command Center</div>
                    <div className="page-title">Home Garden OS</div>
                    <div className="page-meta-row">
                        <span className="page-pill">
                            Personal beds only. CGGC stays separate.
                        </span>
                    </div>
                </div>
            </header>

            <section className="tile tile-calendar">
                <div className="tile-header">
                    <span>Season Plan</span>
                    <span className="page-pill">
                        Bed layouts, plantings, harvest notes – later.
                    </span>
                </div>
                <div className="tile-body">
                    This will visualize your personal garden beds and seasonal tasks.
                </div>
            </section>
        </>
    );
}
