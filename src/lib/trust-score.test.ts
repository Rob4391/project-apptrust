import { describe, expect, it } from "vitest";
import type { AppRecord, TrustSignals } from "./app";
import { calculateTrustScore } from "./trust-score";

const app: AppRecord = {
    appId: "com.example.app", reference: "google:com.example.app", store: "google-play", name: "Example", category: "Tools", rating: 4.5, ratings: 1000, downloads: "5M+", developer: "Example", developerEmail: "dev@example.com", developerWebsite: "https://example.com", privacyPolicyUrl: "https://example.com/privacy", icon: null, description: "Example", url: "https://play.google.com/store/apps/details?id=com.example.app", permissions: [],
};

const signals: TrustSignals = {
    websiteUrl: "https://example.com", domain: "example.com", domainAgeYears: 8, registrar: null, websiteReachable: true, httpsEnabled: true, privacyPolicyAvailable: true, developerContactAvailable: true, suspiciousDomain: false,
};

describe("calculateTrustScore", () => {
    it("returns a transparent safe score for strong signals", () => {
        const result = calculateTrustScore(app, signals);
        expect(result.score).toBe(100);
        expect(result.level).toBe("safe");
        expect(result.reasons).toHaveLength(4);
    });

    it("clamps risky scores and explains the recommendation", () => {
        const result = calculateTrustScore({ ...app, downloads: null, permissions: ["camera", "microphone", "contacts", "sms", "location", "storage"] }, { ...signals, websiteUrl: null, websiteReachable: null, httpsEnabled: false, privacyPolicyAvailable: false, suspiciousDomain: true });
        expect(result.score).toBeLessThan(40);
        expect(result.level).toBe("high-risk");
        expect(result.reasons).toEqual(expect.arrayContaining([
            "Developer domain is older than five years (+20)",
            "App lists many permissions (-10)",
            "Developer website is not listed (-15)",
            "Developer domain looks suspicious (-20)",
        ]));
    });
});