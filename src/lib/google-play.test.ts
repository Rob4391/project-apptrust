import { describe, expect, it } from "vitest";
import { parseGooglePlayAppId } from "./google-play";

describe("parseGooglePlayAppId", () => {
    it("extracts an app ID from a Google Play URL", () => {
        expect(parseGooglePlayAppId("https://play.google.com/store/apps/details?id=com.whatsapp")).toBe("com.whatsapp");
    });

    it("accepts the www Google Play hostname", () => {
        expect(parseGooglePlayAppId("https://www.play.google.com/store/apps/details?id=com.example.app&hl=en")).toBe("com.example.app");
    });

    it("rejects non-Google Play URLs and missing app IDs", () => {
        expect(parseGooglePlayAppId("https://apps.apple.com/app/whatsapp/id310633997")).toBeNull();
        expect(parseGooglePlayAppId("https://play.google.com/store/apps")).toBeNull();
        expect(parseGooglePlayAppId("not-a-url")).toBeNull();
    });
});