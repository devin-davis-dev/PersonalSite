import * as useIsMountedModule from "../../hooks/use-is-mounted";
import { render, screen } from "../../test-utils";
import ClientOnly from "./ClientOnly";

describe("ClientOnly SSR Boundary Behavior", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders fallback before mounting and transitions to children upon mount", () => {
    const isMountedSpy = jest.spyOn(useIsMountedModule, "useIsMounted");

    // State A: SSR / pre-mount
    isMountedSpy.mockReturnValue(false);
    const { rerender } = render(
      <ClientOnly fallback={<output>Loading SSR...</output>}>
        <section aria-label="Client Area">Client Content Loaded</section>
      </ClientOnly>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading SSR...");
    expect(
      screen.queryByRole("region", { name: "Client Area" }),
    ).not.toBeInTheDocument();

    // CAUSE: Client hydration completes (isMounted becomes true)
    isMountedSpy.mockReturnValue(true);
    rerender(
      <ClientOnly fallback={<output>Loading SSR...</output>}>
        <section aria-label="Client Area">Client Content Loaded</section>
      </ClientOnly>,
    );

    // EFFECT: Fallback unmounted, children displayed
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Client Area" }),
    ).toBeInTheDocument();
  });

  it("defers evaluation of render-prop function until mounted", () => {
    const isMountedSpy = jest.spyOn(useIsMountedModule, "useIsMounted");
    const renderContent = jest.fn(() => <span>Lazy Client Content</span>);

    // State A: SSR / pre-mount
    isMountedSpy.mockReturnValue(false);
    const { rerender } = render(
      <ClientOnly fallback={<span>Fallback</span>}>{renderContent}</ClientOnly>,
    );

    // Render-prop must NOT be evaluated during SSR
    expect(renderContent).not.toHaveBeenCalled();
    expect(screen.getByText("Fallback")).toBeInTheDocument();

    // CAUSE: Mounting occurs
    isMountedSpy.mockReturnValue(true);
    rerender(
      <ClientOnly fallback={<span>Fallback</span>}>{renderContent}</ClientOnly>,
    );

    // EFFECT: Render-prop is evaluated and mounted content displayed
    expect(renderContent).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Lazy Client Content")).toBeInTheDocument();
  });

  it("renders empty DOM when mounted check is false and no fallback is provided", () => {
    jest.spyOn(useIsMountedModule, "useIsMounted").mockReturnValue(false);

    const { container } = render(
      <ClientOnly>
        <div>Content</div>
      </ClientOnly>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
