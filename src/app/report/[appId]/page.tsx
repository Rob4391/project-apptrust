"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppRecord } from "@/lib/app";
import { explainPermissions } from "@/lib/permissions";

export default function AppReport() {
    const params = useParams<{ appId: string }>();
    const appReference = decodeURIComponent(params.appId);
    const [app, setApp] = useState<AppRecord | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            <a className="store-link" href={app.url} target="_blank" rel="noreferrer">View on {app.store === "apple-app-store" ? "Apple App Store" : "Google Play"} ↗</a>
        </main>
    );
}