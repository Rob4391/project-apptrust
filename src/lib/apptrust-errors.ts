export type AppTrustErrorCode = "INVALID_INPUT" | "NOT_FOUND" | "UPSTREAM_UNAVAILABLE";

export class AppTrustError extends Error {
    constructor(
        public readonly code: AppTrustErrorCode,
        message: string,
        public readonly status: 400 | 404 | 502,
    ) {
        super(message);
        this.name = "AppTrustError";
    }
}

export function isNotFoundError(error: unknown): boolean {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    return message.includes("not found") || message.includes("404");
}