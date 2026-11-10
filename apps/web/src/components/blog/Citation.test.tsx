import { act, fireEvent, render, screen } from "../../test-utils";
import { Citation } from "./Citation";
import { CitationProvider } from "./CitationContext";
import { Reference } from "./Reference";
import { ReferenceList } from "./ReferenceList";

describe("Citations & References", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.useFakeTimers();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders citation and reference items properly", () => {
    render(
      <CitationProvider>
        <p>
          Some statement <Citation to="activision">(Activision, n.d.)</Citation>
          .
        </p>
        <ReferenceList>
          <Reference id="activision">
            Activision. Call of Duty PC Audio Guide.
          </Reference>
        </ReferenceList>
      </CitationProvider>,
    );

    expect(screen.getByText("(Activision, n.d.)")).toBeInTheDocument();
    expect(
      screen.getByText("Activision. Call of Duty PC Audio Guide."),
    ).toBeInTheDocument();

    const refItem = screen
      .getByText("Activision. Call of Duty PC Audio Guide.")
      .closest("li");
    expect(refItem).not.toHaveAttribute("data-highlighted");
  });

  it("highlights the reference and scrolls when citation is clicked", () => {
    render(
      <CitationProvider>
        <p>
          Some statement <Citation to="activision">(Activision, n.d.)</Citation>
          .
        </p>
        <ReferenceList>
          <Reference id="activision">
            Activision. Call of Duty PC Audio Guide.
          </Reference>
        </ReferenceList>
      </CitationProvider>,
    );

    const citationLink = screen.getByText("(Activision, n.d.)");
    fireEvent.click(citationLink);

    const refItem = screen
      .getByText("Activision. Call of Duty PC Audio Guide.")
      .closest("li");
    expect(refItem).toHaveAttribute("data-highlighted", "true");
  });

  it("preserves highlight at destination and only removes it when user scrolls away", () => {
    render(
      <CitationProvider>
        <p>
          Some statement <Citation to="activision">(Activision, n.d.)</Citation>
          .
        </p>
        <ReferenceList>
          <Reference id="activision">
            Activision. Call of Duty PC Audio Guide.
          </Reference>
        </ReferenceList>
      </CitationProvider>,
    );

    const citationLink = screen.getByText("(Activision, n.d.)");
    fireEvent.click(citationLink);

    const refItem = screen
      .getByText("Activision. Call of Duty PC Audio Guide.")
      .closest("li");
    expect(refItem).toHaveAttribute("data-highlighted", "true");

    // Travel scroll events during navigation do not dismiss the highlight
    fireEvent.scroll(window);
    expect(refItem).toHaveAttribute("data-highlighted", "true");

    // Arrival settles (debounced after scrolling ceases)
    act(() => {
      jest.advanceTimersByTime(350);
    });

    // The highlight stays visible after arrival!
    expect(refItem).toHaveAttribute("data-highlighted", "true");

    // Small micro-scroll or bounce at the bottom (< 20px) preserves the highlight
    Object.defineProperty(window, "scrollY", {
      value: 10,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    expect(refItem).toHaveAttribute("data-highlighted", "true");

    // User actually scrolls away by > 35px
    Object.defineProperty(window, "scrollY", {
      value: 120,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);

    // Highlight is removed
    expect(refItem).not.toHaveAttribute("data-highlighted");
  });

  it("handles delegated click on standard anchor links with #ref- prefix", () => {
    render(
      <CitationProvider>
        <p>
          <a href="#ref-activision">Standard Link</a>
        </p>
        <ReferenceList>
          <Reference id="activision">
            Activision. Call of Duty PC Audio Guide.
          </Reference>
        </ReferenceList>
      </CitationProvider>,
    );

    const link = screen.getByText("Standard Link");
    fireEvent.click(link);

    const refItem = screen
      .getByText("Activision. Call of Duty PC Audio Guide.")
      .closest("li");
    expect(refItem).toHaveAttribute("data-highlighted", "true");
  });
});
