import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import Home from "./page";

afterEach(() => {
    cleanup();
});

describe("AppTrust homepage", () => {
    it("renders the app lookup experience", () => {
        render(<Home />);

        expect(screen.getByRole("heading", { name: /know what you're installing/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Start with an app")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /check app/i })).toBeInTheDocument();
    });

    it("confirms a submitted app URL", async () => {
        const user = userEvent.setup();
        render(<Home />);

        await user.type(screen.getByLabelText("Start with an app"), "https://play.google.com/store/apps/details?id=com.whatsapp");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        expect(screen.getByText("We'll have a report ready when the lookup service is connected.")).toBeInTheDocument();
    });

    it("announces submission feedback politely", async () => {
        const user = userEvent.setup();
        render(<Home />);

        const statusMessage = screen.getByRole("status");

        expect(statusMessage).toHaveAttribute("aria-live", "polite");
        expect(statusMessage).toHaveTextContent("No account needed · Free to check");

        await user.type(screen.getByLabelText("Start with an app"), "https://play.google.com/store/apps/details?id=com.whatsapp");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        expect(statusMessage).toHaveTextContent("We'll have a report ready when the lookup service is connected.");
    });

    it("requires an app URL before submitting", async () => {
        const user = userEvent.setup();
        render(<Home />);

        const input = screen.getByLabelText("Start with an app");
        await user.click(screen.getByRole("button", { name: /check app/i }));

        expect(input).toBeInvalid();
        expect(screen.getByText("No account needed · Free to check")).toBeInTheDocument();
    });
});