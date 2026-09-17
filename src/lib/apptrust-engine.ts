import { getAppleApp, parseAppleStoreAppId } from "./apple-store";
import { AppTrustError, isNotFoundError } from "./apptrust-errors";
import { parseAppReference } from "./app";
import type { AppRecord, TrustSignals } from "./app";
import { getGooglePlayApp, normalizeGooglePlayAppId, parseGooglePlayAppId } from "./google-play";

const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;
const cache = new Map<string, { expiresAt: number; value: AppRecord }>();

type LookupSource = {
    app: () => Promise<AppRecord>;
    storeName: string;
};

export function resolveLookupSource(inputUrl: string | null, requestedId: string | null): LookupSource {
    const reference = requestedId ? parseAppReference(requestedId) : null;
    const appleId = inputUrl
        ? parseAppleStoreAppId(inputUrl)
        : reference?.store === "apple-app-store"
            ? reference.appId
            : null;
    const googleId = inputUrl
        ? parseGooglePlayAppId(inputUrl)
        : reference?.store === "google-play"
            ? normalizeGooglePlayAppId(reference.appId)
            : !reference
                ? normalizeGooglePlayAppId(requestedId)
                : null;

    if (appleId) {
        return { app: () => getAppleApp(appleId), storeName: "Apple App Store" };
    }

    if (googleId) {
        return { app: () => getGooglePlayApp(googleId), storeName: "Google Play" };
    }

    throw new AppTrustError("INVALID_INPUT", "Enter a valid Google Play or Apple App Store URL.", 400);
}

async function withTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
        operation(),
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("request timeout")), REQUEST_TIMEOUT_MS)),
    ]);
}

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            return await withTimeout(operation);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}

async function checkWebsite(app: AppRecord): Promise<TrustSignals> {
    const websiteUrl = app.developerWebsite;
    const privacyPolicyAvailable = Boolean(app.privacyPolicyUrl);
    const developerContactAvailable = Boolean(app.developerEmail || app.developerWebsite);

    if (!websiteUrl) {
        return { websiteUrl: null, websiteReachable: null, httpsEnabled: false, privacyPolicyAvailable, developerContactAvailable };
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(websiteUrl);
    } catch {
        return { websiteUrl, websiteReachable: false, httpsEnabled: false, privacyPolicyAvailable, developerContactAvailable };
    }

    let websiteReachable = false;
    try {
        const response = await withTimeout(() => fetch(parsedUrl, { method: "HEAD" }));
        websiteReachable = response.ok;
    } catch {
        websiteReachable = false;
    }

    return {
        websiteUrl,
        websiteReachable,
        httpsEnabled: parsedUrl.protocol === "https:",
        privacyPolicyAvailable,
        developerContactAvailable,
    };
}

export async function lookupApp(inputUrl: string | null, requestedId: string | null): Promise<AppRecord> {
    const source = resolveLookupSource(inputUrl, requestedId);
    const cacheKey = inputUrl ?? requestedId ?? "unknown";
    const cached = cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
        console.info(JSON.stringify({ event: "app_lookup_cache_hit", store: source.storeName }));
        return cached.value;
    }

    console.info(JSON.stringify({ event: "app_lookup_started", store: source.storeName }));

    try {
        const app = await withRetry(source.app);
        const value = { ...app, trustSignals: await checkWebsite(app) };
        cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value });
        console.info(JSON.stringify({ event: "app_lookup_completed", store: source.storeName, success: true }));
        return value;
    } catch (error) {
        const notFound = isNotFoundError(error);
        console.error(JSON.stringify({ event: "app_lookup_failed", store: source.storeName, code: notFound ? "NOT_FOUND" : "UPSTREAM_UNAVAILABLE" }));
        throw new AppTrustError(
            notFound ? "NOT_FOUND" : "UPSTREAM_UNAVAILABLE",
            notFound ? `We could not find that ${source.storeName} app.` : `${source.storeName} is temporarily unavailable. Try again shortly.`,
            notFound ? 404 : 502,
        );
    }
}