import { describe, expect, it } from "vitest";
import { explainPermissions, normalizePermission } from "./permissions";

describe("permission knowledge base", () => {
    it("normalizes supported Android permission names", () => {
        expect(normalizePermission("android.permission.ACCESS_FINE_LOCATION")).toBe("location");
        expect(normalizePermission("READ_CONTACTS")).toBe("contacts");
        expect(normalizePermission("POST_NOTIFICATIONS")).toBe("notifications");
    });

    it("explains known permissions and removes duplicates", () => {
        const explanations = explainPermissions(["camera", "CAMERA", "android.permission.RECORD_AUDIO"]);

        expect(explanations.map((permission) => permission.key)).toEqual(["camera", "microphone"]);
        expect(explanations.find((permission) => permission.key === "microphone")?.risk).toBe("medium");
    });

    it("ignores unknown permissions", () => {
        expect(explainPermissions(["android.permission.UNKNOWN_PERMISSION"])).toEqual([]);
    });
});