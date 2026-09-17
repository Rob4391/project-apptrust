"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppRecord, ScanStage } from "@/lib/app";
import { explainPermissions } from "@/lib/permissions";

export default function AppReport() {
    const params = useParams<{ appId: string }>();
    const appReference = decodeURIComponent(params.appId);
    const [app, setApp] = useState<AppRecord | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [visibleStages, setVisibleStages] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadApp() {
            try {
                const response = await fetch(`/api/apps?id=${encodeURIComponent(appReference)}`, {
                    signal: controller.signal,
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error ?? "Unable to load app report.");
                }

                setApp(data);
            } catch (loadError) {
                if (loadError instanceof Error && loadError.name === "AbortError") {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : "Unable to load app report.");
            }
        }

        loadApp();
        return () => controller.abort();
    }, [appReference]);

    const scanStages = app?.scanStages ?? [];

    useEffect(() => {
        if (visibleStages >= scanStages.length) return;

        const timer = window.setTimeout(() => setVisibleStages((count) => count + 1), 260);
        return () => window.clearTimeout(timer);
    }, [scanStages.length, visibleStages]);

    if (error) {
        return <main className="report-shell"><p className="report-error">{error}</p><Link href="/">← Check another app</Link></main>;
    }

    if (!app) {
        return <main className="report-shell"><p className="report-loading">Building your app report...</p></main>;
    }

    const permissionExplanations = explainPermissions(app.permissions);

    return (
        <main className="report-shell">
            <nav className="report-nav"><Link className="brand" href="/"><span className="brand-mark">+</span> AppTrust</Link><span>{app.store === "apple-app-store" ? "APPLE REPORT" : "GOOGLE PLAY REPORT"} / LIVE</span></nav>
            <Link className="back-link" href="/">← Check another app</Link>
            <section className="report-hero">
                <div className="report-app-icon">{app.icon ? <Image src={app.icon} alt="" width={112} height={112} /> : <span>{app.name.slice(0, 1)}</span>}</div>
                <div><p className="eyebrow">{app.store === "apple-app-store" ? "Apple App Store app" : "Google Play app"}</p><h1>{app.name}</h1><p className="report-developer">{app.developer} · {app.category ?? "App"}</p></div>
            </section>
            <section className="app-facts" aria-label="App information">
                <div><span>Rating</span><strong>{app.rating ? `${app.rating.toFixed(1)} / 5` : "Not available"}</strong></div>
                <div><span>{app.store === "apple-app-store" ? "Platform" : "Downloads"}</span><strong>{app.downloads ?? "iPhone / iPad"}</strong></div>
                <div><span>Ratings</span><strong>{app.ratings?.toLocaleString() ?? "Not available"}</strong></div>
            </section>
            <section className="scan-section" aria-labelledby="scan-title">
                <div className="scan-heading"><div><p className="eyebrow">AppTrust analysis</p><h2 id="scan-title">Trust scan pipeline</h2></div><span className="scan-progress-label">{visibleStages === scanStages.length ? "Complete" : "Checking"}</span></div>
                <div className="scan-progress" aria-label={`${visibleStages} of ${scanStages.length} checks complete`}><span style={{ width: `${scanStages.length ? (visibleStages / scanStages.length) * 100 : 0}%` }} /></div>
                <div className="scan-pipeline">
                    {scanStages.map((stage: ScanStage, index) => {
                        const visible = index < visibleStages;
                        return <div className={`scan-node ${visible ? `scan-${stage.status}` : "scan-pending"}`} key={stage.key}><span className="scan-node-dot">{visible ? stage.status === "passed" ? "✓" : "!" : index + 1}</span><div><strong>{stage.label}</strong><small>{visible ? stage.detail : "Waiting"}</small></div>{index < scanStages.length - 1 && <i aria-hidden="true" />}</div>;
                    })}
                </div>
            </section>
            <section className="report-section"><p className="eyebrow">What we found</p><h2>A clearer picture before the download.</h2><p>{app.description}</p></section>
            <section className="permission-section" aria-labelledby="permissions-title">
                <p className="eyebrow">Permission translator</p>
                <h2 id="permissions-title">What access does this app need?</h2>
                {permissionExplanations.length > 0 ? (
                    <div className="permission-grid">
                        {permissionExplanations.map((permission) => (
                            <article className="permission-card" key={permission.key}>
                                <div className="permission-card-heading"><h3>{permission.name}</h3><span className={`risk risk-${permission.risk}`}>{permission.risk} concern</span></div>
                                <p>{permission.allows}</p>
                                <strong>Common reasons</strong>
                                <ul>{permission.commonReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                                <small>{permission.riskExplanation}</small>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="permission-empty">This store listing does not provide permission details yet. AppTrust will explain them here when the store makes them available.</p>
                )}
            </section>
            {app.trustSignals && (
                <section className="trust-section" aria-labelledby="trust-signals-title">
                    <p className="eyebrow">Developer signals</p>
                    <h2 id="trust-signals-title">A few useful checks.</h2>
                    <div className="trust-signal-grid">
                        <div><span>Website</span><strong>{app.trustSignals.websiteUrl ? "Found" : "Not listed"}</strong></div>
                        <div><span>Website status</span><strong>{app.trustSignals.websiteReachable === null ? "Not checked" : app.trustSignals.websiteReachable ? "Reachable" : "Unavailable"}</strong></div>
                        <div><span>HTTPS</span><strong>{app.trustSignals.httpsEnabled ? "Enabled" : "Not confirmed"}</strong></div>
                        <div><span>Privacy policy</span><strong>{app.trustSignals.privacyPolicyAvailable ? "Available" : "Not listed"}</strong></div>
                        <div><span>Developer contact</span><strong>{app.trustSignals.developerContactAvailable ? "Available" : "Not listed"}</strong></div>
                    </div>
                </section>
            )}
            {app.trustScore && (
                <section className="score-section" aria-labelledby="trust-score-title">
                    <div className="score-summary">
                        <div><p className="eyebrow">AppTrust recommendation</p><h2 id="trust-score-title">Trust score</h2><p>{app.trustScore.recommendation}</p></div>
                        <div className={`trust-score trust-score-${app.trustScore.level}`}><strong>{app.trustScore.score}</strong><span>/100</span></div>
                    </div>
                    <div className="score-reasons"><strong>Score signals</strong><ul>{app.trustScore.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
                </section>
            )}
            <a className="store-link" href={app.url} target="_blank" rel="noreferrer">View on {app.store === "apple-app-store" ? "Apple App Store" : "Google Play"} ↗</a>
        </main>
    );
}