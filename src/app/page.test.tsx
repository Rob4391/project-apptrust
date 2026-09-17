import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const { fetchMock, routerPush } = vi.hoisted(() => ({
    fetchMock: vi.fn(),
    routerPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: routerPush }),
}));

beforeEach(() => {
    fetchMock.mockReset();
    routerPush.mockReset();
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("AppTrust homepage", () => {
    it("renders the app lookup experience", () => {
        render(React.createElement(Home));

        expect(screen.getByRole("heading", { name: /know what you're installing/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Start with an app")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /check app/i })).toBeInTheDocument();
    });

    it("looks up a submitted app URL and opens its report", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ appId: "com.whatsapp", reference: "google:com.whatsapp" }),
        });
        render(React.createElement(Home));

        await user.type(screen.getByLabelText("Start with an app"), "https://play.google.com/store/apps/details?id=com.whatsapp");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/api/apps?url="));
        expect(routerPush).toHaveBeenCalledWith("/report/google%3Acom.whatsapp");
    });

    it("announces submission feedback politely", async () => {
        const user = userEvent.setup();
        fetchMock.mockResolvedValue({
            ok: false,
            json: async () => ({ error: "Enter a valid Google Play app URL." }),
        });
        render(React.createElement(Home));

        const statusMessage = screen.getByRole("status");

        expect(statusMessage).toHaveAttribute("aria-live", "polite");
        expect(statusMessage).toHaveTextContent("No account needed · Free to check");

        await user.type(screen.getByLabelText("Start with an app"), "https://play.google.com/store/apps/details?id=com.whatsapp");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        await waitFor(() => expect(statusMessage).toHaveTextContent("Enter a valid Google Play app URL."));
    });

    it("requires an app URL before submitting", async () => {
        const user = userEvent.setup();
        render(React.createElement(Home));

        const input = screen.getByLabelText("Start with an app");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        expect(input).toBeInvalid();
        expect(screen.getByText("No account needed · Free to check")).toBeInTheDocument();
    });
});