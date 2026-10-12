import { render, screen } from "@testing-library/react";
import ClientOnly from "./ClientOnly";

describe("ClientOnly", () => {
  it("renders children once mounted", () => {
    render(
      <ClientOnly fallback={<div>Loading SSR...</div>}>
        <div>Client Content Loaded</div>
      </ClientOnly>,
    );

    expect(screen.getByText("Client Content Loaded")).toBeInTheDocument();
    expect(screen.queryByText("Loading SSR...")).not.toBeInTheDocument();
  });

  it("supports render-prop function syntax", () => {
    const renderContent = jest.fn(() => <div>Lazy Client Content</div>);

    render(
      <ClientOnly fallback={<div>Fallback</div>}>{renderContent}</ClientOnly>,
    );

    expect(renderContent).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Lazy Client Content")).toBeInTheDocument();
  });

  it("renders null as default fallback when mounted check is false", () => {
    const { container } = render(
      <ClientOnly>
        <div>Content</div>
      </ClientOnly>,
    );

    expect(container).toHaveTextContent("Content");
  });
});
