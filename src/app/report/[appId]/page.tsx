"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppRecord } from "@/lib/app";

export default function AppReport() {
    const params = useParams<{ appId: string }>();
    const [app, setApp] = useState<AppRecord | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadApp() {
            try {
                const response = await fetch(`/api/apps?id=${encodeURIComponent(params.appId)}`, {
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
    }, [params.appId]);

    if (error) {
        return <main className="report-shell"><p className="report-error">{error}</p><Link href="/">← Check another app</Link></main>;
    }

    if (!app) {
        return <main className="report-shell"><p className="report-loading">Building your app report...</p></main>;
    }

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
            <a className="store-link" href={app.url} target="_blank" rel="noreferrer">View on {app.store === "apple-app-store" ? "Apple App Store" : "Google Play"} ↗</a>
        </main>
    );
}