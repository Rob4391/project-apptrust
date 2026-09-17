import { NextResponse } from "next/server";
import { getAppleApp, parseAppleStoreAppId } from "@/lib/apple-store";
import { parseAppReference } from "@/lib/app";
import { getGooglePlayApp, normalizeGooglePlayAppId, parseGooglePlayAppId } from "@/lib/google-play";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const inputUrl = requestUrl.searchParams.get("url");
    const requestedId = requestUrl.searchParams.get("id");
    const reference = requestedId ? parseAppReference(requestedId) : null;
    const appleId = inputUrl ? parseAppleStoreAppId(inputUrl) : reference?.store === "apple-app-store" ? reference.appId : null;
    const googleId = inputUrl ? parseGooglePlayAppId(inputUrl) : reference?.store === "google-play" ? normalizeGooglePlayAppId(reference.appId) : null;

    if (!appleId && !googleId) {
        return NextResponse.json(
            { error: "Enter a valid Google Play or Apple App Store URL." },
            { status: 400 },
        );
    }

    try {
        const app = appleId ? await getAppleApp(appleId) : await getGooglePlayApp(googleId!);
        return NextResponse.json(app);
    } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : "";
        const isNotFound = message.includes("not found") || message.includes("404");
        const storeName = appleId ? "Apple App Store" : "Google Play";

        return NextResponse.json(
            { error: isNotFound ? `We could not find that ${storeName} app.` : `${storeName} is temporarily unavailable. Try again shortly.` },
            { status: isNotFound ? 404 : 502 },
        );
    }
}