import { NextResponse } from "next/server";
import { getGooglePlayApp, normalizeGooglePlayAppId, parseGooglePlayAppId } from "@/lib/google-play";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const inputUrl = requestUrl.searchParams.get("url");
    const requestedId = requestUrl.searchParams.get("id");
    const appId = inputUrl ? parseGooglePlayAppId(inputUrl) : normalizeGooglePlayAppId(requestedId);

    if (!appId) {
        return NextResponse.json(
            { error: "Enter a valid Google Play app URL." },
            { status: 400 },
        );
    }

    try {
        const app = await getGooglePlayApp(appId);
        return NextResponse.json(app);
    } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : "";
        const isNotFound = message.includes("not found") || message.includes("404");

        return NextResponse.json(
            { error: isNotFound ? "We could not find that Google Play app." : "Google Play is temporarily unavailable. Try again shortly." },
            { status: isNotFound ? 404 : 502 },
        );
    }
}