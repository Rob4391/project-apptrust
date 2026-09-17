import { describe, expect, it } from "vitest";
import { parseAppReference } from "./app";

describe("parseAppReference", () => {
    it("parses Google Play and Apple references", () => {
        expect(parseAppReference("google:com.example.app")).toEqual({ store: "google-play", appId: "com.example.app" });
        expect(parseAppReference("apple:310633997")).toEqual({ store: "apple-app-store", appId: "310633997" });
    });

    it("rejects unknown or incomplete references", () => {
        expect(parseAppReference("amazon:example")).toBeNull();
        expect(parseAppReference("apple:")).toBeNull();
        expect(parseAppReference("com.example.app")).toBeNull();
    });
});