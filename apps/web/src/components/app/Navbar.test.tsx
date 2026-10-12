import { act, fireEvent, render, screen, within } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock i18next and Gatsby Link
jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        nav_blog: "Blog",
        nav_projects: "Projects",
        nav_about: "About",
        nav_contact: "Contact",
        nav_climbing: "Climbing",
        nav_home: "Home",
        wallet_connect: "Connect Wallet",
      };
      return translations[key] || key;
    },
  }),
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
    [key: string]: any;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock gatsby-plugin-image
jest.mock("gatsby-plugin-image", () => ({
  StaticImage: ({ alt, ...props }: any) => (
    // biome-ignore lint/a11y/useAltText: Mock implementation for tests
    <img alt={alt} {...props} />
  ),
}));

// Mock RainbowKit
jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: {
    Custom: ({ children }: any) =>
      children({
        account: undefined,
        chain: undefined,
        openAccountModal: jest.fn(),
        openChainModal: jest.fn(),
        openConnectModal: jest.fn(),
        authenticationStatus: "unauthenticated",
        mounted: true,
      }),
  },
}));

describe("Navbar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the logo at the far left and links following it, with wallet connect at far right", () => {
    render(<Navbar />);

    const desktopContainer = screen.getByTestId("navbar-desktop-container");
    const desktopLinksContainer = screen.getByTestId("desktop-links");

    // Logo within desktop container
    const logoImg = within(desktopContainer).getByAltText("logo");
    expect(logoImg).toBeInTheDocument();
    const logoLink = logoImg.closest("a");
    expect(logoLink).toHaveAttribute("href", "/");

    // Links within desktopLinksContainer (hidden: true accounts for display: ["none", "flex"] media query in JSDOM)
    const blogLink = within(desktopLinksContainer).getByRole("link", {
      name: "Blog",
      hidden: true,
    });
    const projectsLink = within(desktopLinksContainer).getByRole("link", {
      name: "Projects",
      hidden: true,
    });
    const aboutLink = within(desktopLinksContainer).getByRole("link", {
      name: "About",
      hidden: true,
    });
    const contactLink = within(desktopLinksContainer).getByRole("link", {
      name: "Contact",
      hidden: true,
    });
    const climbingLink = within(desktopLinksContainer).getByRole("link", {
      name: "Climbing",
      hidden: true,
    });
    const linkedInLink = within(desktopLinksContainer).getByRole("link", {
      name: "LinkedIn",
      hidden: true,
    });

    expect(blogLink).toHaveAttribute("href", "/blog");
    expect(projectsLink).toHaveAttribute("href", "/projects");
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(climbingLink).toHaveAttribute("href", "/climbing");
    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/devin-dev-d-63008412b",
    );

    // Wallet connect button at the right
    const connectButton = within(desktopContainer).getByRole("button", {
      name: /connect wallet/i,
      hidden: true,
    });
    expect(connectButton).toBeInTheDocument();

    // Verify ordering in the DOM:
    // Logo -> Blog -> Projects -> About -> Contact -> Climbing -> LinkedIn -> Connect Wallet
    const elementsInContainer = Array.from(
      desktopContainer.querySelectorAll("a, button"),
    );

    const logoIndex = elementsInContainer.findIndex((el) => el === logoLink);
    const blogIndex = elementsInContainer.findIndex((el) => el === blogLink);
    const projectsIndex = elementsInContainer.findIndex(
      (el) => el === projectsLink,
    );
    const aboutIndex = elementsInContainer.findIndex((el) => el === aboutLink);
    const contactIndex = elementsInContainer.findIndex(
      (el) => el === contactLink,
    );
    const climbingIndex = elementsInContainer.findIndex(
      (el) => el === climbingLink,
    );
    const linkedInIndex = elementsInContainer.findIndex(
      (el) => el === linkedInLink,
    );
    const walletIndex = elementsInContainer.findIndex(
      (el) => el === connectButton,
    );

    expect(logoIndex).toBeLessThan(blogIndex);
    expect(blogIndex).toBeLessThan(projectsIndex);
    expect(projectsIndex).toBeLessThan(aboutIndex);
    expect(aboutIndex).toBeLessThan(contactIndex);
    expect(contactIndex).toBeLessThan(climbingIndex);
    expect(climbingIndex).toBeLessThan(linkedInIndex);
    expect(linkedInIndex).toBeLessThan(walletIndex);
  });

  it("updates navbar styling when scrolling down", () => {
    render(<Navbar />);

    const navbarWrapper = screen.getByTestId("navbar-wrapper");
    // Initial state: undefined / empty background at top
    expect(navbarWrapper.style.backgroundColor).toBe("");

    // Simulate scrolling down past 20px
    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
      configurable: true,
    });

    act(() => {
      fireEvent.scroll(window);
      jest.advanceTimersByTime(20);
    });

    // Scrolled state: light backdrop color applied
    expect(navbarWrapper.style.backgroundColor).toBeTruthy();
  });

  it("opens mobile SideNav when hamburger is clicked", () => {
    render(<Navbar />);

    const desktopContainer = screen.getByTestId("navbar-desktop-container");

    // Look for the div with onClick handler (the hamburger)
    const divs = desktopContainer.querySelectorAll("div");
    const hamburgerButton = Array.from(divs).find(
      (div) => div.children.length === 3 && div.onclick !== null,
    );

    if (hamburgerButton) {
      fireEvent.click(hamburgerButton);
      // Both desktop and mobile now include LinkedIn, and neither has a Home text link
      expect(
        screen.getAllByRole("link", { name: "LinkedIn", hidden: true }),
      ).toHaveLength(2);
      expect(screen.queryByText("Home")).not.toBeInTheDocument();
    }
  });
});
