import type { AppRecord, TrustScore, TrustSignals } from "./app";

function parseDownloadCount(value: string | null): number | null {
    if (!value) return null;
    const match = value.replace(/,/g, "").match(/([\d.]+)\s*([KMB])?\+?/i);
    if (!match) return null;

    const multiplier = { K: 1_000, M: 1_000_000, B: 1_000_000_000 }[match[2]?.toUpperCase() as "K" | "M" | "B"] ?? 1;
    return Number(match[1]) * multiplier;
}

export function calculateTrustScore(app: AppRecord, signals: TrustSignals): TrustScore {
    let score = 50;
    const reasons: string[] = [];

    if (signals.domainAgeYears !== null && signals.domainAgeYears > 5) {
        score += 20;
        reasons.push("Developer domain is older than five years (+20)");
    }

    const downloads = parseDownloadCount(app.downloads);
    if (downloads !== null && downloads > 1_000_000) {
        score += 15;
        reasons.push("App has more than one million downloads (+15)");
    }

    if (signals.privacyPolicyAvailable) {
        score += 10;
        reasons.push("Privacy policy is available (+10)");
    }

    if (signals.websiteUrl && signals.websiteReachable && signals.httpsEnabled) {
        score += 10;
        reasons.push("Developer website is reachable over HTTPS (+10)");
    }

    const knownPermissions = app.permissions.length;
    if (knownPermissions >= 6) {
        score -= 10;
        reasons.push("App lists many permissions (-10)");
    }

    if (!signals.websiteUrl) {
        score -= 15;
        reasons.push("Developer website is not listed (-15)");
    }

    if (signals.suspiciousDomain) {
        score -= 20;
        reasons.push("Developer domain looks suspicious (-20)");
    }

    const normalizedScore = Math.max(0, Math.min(100, score));
    const level = normalizedScore >= 70 ? "safe" : normalizedScore >= 40 ? "medium-risk" : "high-risk";

    return {
        score: normalizedScore,
        level,
        recommendation: level === "safe" ? "Looks good, but review the permissions before installing." : level === "medium-risk" ? "Review the signals and permissions before installing." : "Use caution and verify the developer before installing.",
        reasons,
    };
}