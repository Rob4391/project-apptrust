import { NextResponse } from "next/server";
import { AppTrustError } from "@/lib/apptrust-errors";
import { lookupApp } from "@/lib/apptrust-engine";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const inputUrl = requestUrl.searchParams.get("url");
    try {
        const app = await lookupApp(inputUrl, requestUrl.searchParams.get("id"));
        return NextResponse.json(app);
    } catch (error) {
        if (error instanceof AppTrustError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Unable to complete app lookup." }, { status: 500 });
    }
}