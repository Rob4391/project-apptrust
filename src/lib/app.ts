export type AppStore = "google-play" | "apple-app-store";

export type TrustSignals = {
    websiteUrl: string | null;
    domain: string | null;
    domainAgeYears: number | null;
    registrar: string | null;
    websiteReachable: boolean | null;
    httpsEnabled: boolean;
    privacyPolicyAvailable: boolean;
    developerContactAvailable: boolean;
    suspiciousDomain: boolean;
};

export type TrustScore = {
    score: number;
    level: "safe" | "medium-risk" | "high-risk";
    recommendation: string;
    reasons: string[];
};

export type ScanStage = {
    key: string;
    label: string;
    detail: string;
    status: "passed" | "warning" | "unavailable";
};

export type AppRecord = {
    appId: string;
    reference: string;
    store: AppStore;
    name: string;
    category: string | null;
    rating: number | null;
    ratings: number | null;
    downloads: string | null;
    developer: string;
    developerEmail: string | null;
    developerWebsite: string | null;
    privacyPolicyUrl: string | null;
    icon: string | null;
    description: string;
    url: string;
    permissions: string[];
    trustSignals?: TrustSignals;
    trustScore?: TrustScore;
    scanStages?: ScanStage[];
};

export function parseAppReference(value: string): { store: AppStore; appId: string } | null {
    const separatorIndex = value.indexOf(":");
    if (separatorIndex < 1) {
        return null;
    }

    const storeName = value.slice(0, separatorIndex);
    const appId = value.slice(separatorIndex + 1);
    if ((storeName !== "google" && storeName !== "apple") || !appId) {
        return null;
    }

    return {
        store: storeName === "google" ? "google-play" : "apple-app-store",
        appId,
    };
}