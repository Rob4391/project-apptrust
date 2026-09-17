import { describe, expect, it } from "vitest";
import { AppTrustError } from "./apptrust-errors";
import { resolveLookupSource } from "./apptrust-engine";

describe("AppTrust engine", () => {
    it("resolves Google Play and Apple App Store sources", () => {
        expect(resolveLookupSource("https://play.google.com/store/apps/details?id=com.example.app", null).storeName).toBe("Google Play");
        expect(resolveLookupSource("https://apps.apple.com/us/app/example/id123456789", null).storeName).toBe("Apple App Store");
    });

    it("supports platform references and legacy Google IDs", () => {
        expect(resolveLookupSource(null, "apple:123456789").storeName).toBe("Apple App Store");
        expect(resolveLookupSource(null, "com.example.app").storeName).toBe("Google Play");
    });

    it("rejects unsupported lookup input with a structured error", () => {
        expect(() => resolveLookupSource("https://example.com/app", null)).toThrowError(AppTrustError);
        try {
            resolveLookupSource("https://example.com/app", null);
        } catch (error) {
            expect(error).toMatchObject({ code: "INVALID_INPUT", status: 400 });
        }
    });
});