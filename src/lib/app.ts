export type AppStore = "google-play" | "apple-app-store";

export type TrustSignals = {
    websiteUrl: string | null;
    websiteReachable: boolean | null;
    httpsEnabled: boolean;
    privacyPolicyAvailable: boolean;
    developerContactAvailable: boolean;
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