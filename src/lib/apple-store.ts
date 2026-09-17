import appStore from "app-store-scraper";
import type { AppRecord } from "./app";

export type AppleApp = AppRecord;

export function parseAppleStoreAppId(value: string): string | null {
    try {
        const url = new URL(value);
        if (url.hostname !== "apps.apple.com" && !url.hostname.endsWith(".apps.apple.com")) {
            return null;
        }

        const match = url.pathname.match(/\/id(\d+)(?:$|\/)/);
        return match?.[1] ?? null;
    } catch {
        return null;
    }
}

export async function getAppleApp(appId: string): Promise<AppleApp> {
    const app = await appStore.app({ id: appId, country: "us" });

    return {
        appId: String(app.id),
        reference: `apple:${app.id}`,
        store: "apple-app-store",
        name: app.title,
        category: app.genre ?? null,
        rating: app.score ?? null,
        ratings: app.reviews ?? null,
        downloads: null,
        developer: app.developer,
        developerEmail: app.developerWebsite ?? null,
        developerWebsite: app.developerWebsite ?? null,
        icon: app.icon ?? null,
        description: app.description,
        url: app.url,
        permissions: [],
        privacyPolicyUrl: app.privacyPolicy ?? null,
    };
}