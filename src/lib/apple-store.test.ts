import { describe, expect, it } from "vitest";
import { parseAppleStoreAppId } from "./apple-store";

describe("parseAppleStoreAppId", () => {
    it("extracts an app ID from an Apple App Store URL", () => {
        expect(parseAppleStoreAppId("https://apps.apple.com/us/app/whatsapp-messenger/id310633997")).toBe("310633997");
    });

    it("supports regional Apple store domains", () => {
        expect(parseAppleStoreAppId("https://itunes.apple.com/gb/app/example/id123456789")).toBeNull();
        expect(parseAppleStoreAppId("https://de.apps.apple.com/de/app/example/id123456789")).toBe("123456789");
    });

    it("rejects malformed or non-Apple URLs", () => {
        expect(parseAppleStoreAppId("https://play.google.com/store/apps/details?id=com.example.app")).toBeNull();
        expect(parseAppleStoreAppId("https://apps.apple.com/us/app/example")).toBeNull();
        expect(parseAppleStoreAppId("not-a-url")).toBeNull();
    });
});