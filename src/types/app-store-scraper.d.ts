declare module "app-store-scraper" {
    type AppStoreResult = {
        id: number;
        title: string;
        developer: string;
        genre?: string;
        score?: number;
        reviews?: number;
        developerWebsite?: string;
        icon?: string;
        description: string;
        url: string;
    };

    const appStore: {
        app(options: { id: string; country?: string }): Promise<AppStoreResult>;
    };

    export default appStore;
}