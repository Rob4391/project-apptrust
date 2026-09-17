import { NextResponse } from "next/server";
import { getGooglePlayApp, parseGooglePlayAppId } from "@/lib/google-play";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const inputUrl = requestUrl.searchParams.get("url");
    const appId = requestUrl.searchParams.get("id") ?? (inputUrl ? parseGooglePlayAppId(inputUrl) : null);

    if (!appId) {
        return NextResponse.json(
            { error: "Enter a valid Google Play app URL." },
            { status: 400 },
        );
    }

    try {
        const app = await getGooglePlayApp(appId);
        return NextResponse.json(app);
    } catch {
        return NextResponse.json(
            { error: "We could not find that Google Play app." },
            { status: 404 },
        );
    }
}