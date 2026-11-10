import { fireEvent, render, screen } from "../../test-utils";
import { Collapsible } from "./Collapsible";

describe("Collapsible", () => {
  it("renders collapsed by default with content hidden", () => {
    render(
      <Collapsible title="Test Collapsible">
        <p>Hidden body text</p>
      </Collapsible>,
    );

    expect(screen.getByText("Test Collapsible")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /Test Collapsible/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    const content = screen.getByText("Hidden body text").closest("section");
    expect(content).toHaveAttribute("hidden");
  });

  it("expands content on click and updates aria-expanded", () => {
    render(
      <Collapsible title="Expandable Section">
        <p>Secret content</p>
      </Collapsible>,
    );

    const button = screen.getByRole("button", { name: /Expandable Section/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const content = screen.getByText("Secret content").closest("section");
    expect(content).not.toHaveAttribute("hidden");

    // Click again to collapse
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("hidden");
  });

  it("renders open when defaultOpen is true", () => {
    render(
      <Collapsible title="Initially Open" defaultOpen={true}>
        <p>Already visible</p>
      </Collapsible>,
    );

    const button = screen.getByRole("button", { name: /Initially Open/i });
    expect(button).toHaveAttribute("aria-expanded", "true");
    const content = screen.getByText("Already visible").closest("section");
    expect(content).not.toHaveAttribute("hidden");
  });

  it("displays optional badge when provided", () => {
    render(
      <Collapsible title="Quick Setup" badge="TL;DR">
        <p>Quick content</p>
      </Collapsible>,
    );

    expect(screen.getByText("TL;DR")).toBeInTheDocument();
  });

  it("supports summary prop as alternative to title", () => {
    render(
      <Collapsible summary="Summary Title">
        <p>Body</p>
      </Collapsible>,
    );

    expect(screen.getByText("Summary Title")).toBeInTheDocument();
  });
});
