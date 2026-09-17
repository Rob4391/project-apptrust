import gplay from "google-play-scraper";
import type { AppRecord } from "./app";

export type GooglePlayApp = AppRecord;

export function parseGooglePlayAppId(value: string): string | null {
    try {
        const url = new URL(value);

        if (url.hostname !== "play.google.com" && url.hostname !== "www.play.google.com") {
            return null;
        }

        return normalizeGooglePlayAppId(url.searchParams.get("id"));
    } catch {
        return null;
    }
}

export async function getGooglePlayApp(appId: string): Promise<GooglePlayApp> {
    const app = await gplay.app({ appId, lang: "en", country: "us" });

    return {
        appId: app.appId,
        reference: `google:${app.appId}`,
        store: "google-play",
        name: app.title,
        category: app.genre ?? null,
        rating: app.score ?? null,
        ratings: app.ratings ?? null,
        downloads: app.installs ?? null,
        developer: app.developer,
        developerEmail: app.developerEmail ?? null,
        developerWebsite: app.developerWebsite ?? null,
        icon: app.icon ?? null,
        description: app.description,
        url: app.url,
    };
}

export function normalizeGooglePlayAppId(value: string | null): string | null {
    return value && /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/.test(value) ? value : null;
}