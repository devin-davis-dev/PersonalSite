import type React from "react";
import { fireEvent, render, screen } from "../../test-utils";
import ConnectWallet from "./ConnectWallet";

// Mock i18next
jest.mock("gatsby-plugin-react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        wallet_connect: "Connect Wallet",
        wallet_wrong_network: "Wrong Network",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock RainbowKit custom connect button
let mockCustomButtonProps: {
  account?: { address: string; displayName: string; displayBalance?: string };
  chain?: { id: number; name: string; unsupported?: boolean };
  openAccountModal: jest.Mock;
  openChainModal: jest.Mock;
  openConnectModal: jest.Mock;
  authenticationStatus?: "loading" | "authenticated" | "unauthenticated";
  mounted: boolean;
};

jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: {
    Custom: ({
      children,
    }: {
      children: (props: typeof mockCustomButtonProps) => React.ReactNode;
    }) => children(mockCustomButtonProps),
  },
}));

describe("ConnectWallet", () => {
  beforeEach(() => {
    mockCustomButtonProps = {
      account: undefined,
      chain: undefined,
      openAccountModal: jest.fn(),
      openChainModal: jest.fn(),
      openConnectModal: jest.fn(),
      authenticationStatus: "unauthenticated",
      mounted: true,
    };
  });

  it("renders subtle disconnected button and opens connect modal on click", () => {
    render(<ConnectWallet isScrolledTop={true} />);

    const button = screen.getByRole("button", { name: /connect wallet/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("⟠")).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockCustomButtonProps.openConnectModal).toHaveBeenCalledTimes(1);
  });

  it("renders wrong network warning when chain is unsupported", () => {
    mockCustomButtonProps = {
      ...mockCustomButtonProps,
      account: { address: "0x123", displayName: "0x123...456" },
      chain: { id: 999999, name: "Unknown", unsupported: true },
      authenticationStatus: "authenticated",
    };

    render(<ConnectWallet isScrolledTop={true} />);

    const button = screen.getByRole("button", { name: /wrong network/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockCustomButtonProps.openChainModal).toHaveBeenCalledTimes(1);
  });

  it("renders connected badge with network and account segments", () => {
    mockCustomButtonProps = {
      ...mockCustomButtonProps,
      account: {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        displayName: "0x1234...5678",
        displayBalance: "1.25 ETH",
      },
      chain: { id: 11155111, name: "Sepolia", unsupported: false },
      authenticationStatus: "authenticated",
    };

    render(<ConnectWallet isScrolledTop={true} showBalance={true} />);

    expect(screen.getByText("Sepolia")).toBeInTheDocument();
    expect(screen.getByText("0x1234...5678")).toBeInTheDocument();
    expect(screen.getByText("(1.25 ETH)")).toBeInTheDocument();

    // Click network segment
    fireEvent.click(screen.getByText("Sepolia"));
    expect(mockCustomButtonProps.openChainModal).toHaveBeenCalledTimes(1);

    // Click account segment
    fireEvent.click(screen.getByText("0x1234...5678"));
    expect(mockCustomButtonProps.openAccountModal).toHaveBeenCalledTimes(1);
  });

  it("renders properly with light header (isScrolledTop=false)", () => {
    render(<ConnectWallet isScrolledTop={false} />);

    const button = screen.getByRole("button", { name: /connect wallet/i });
    expect(button).toBeInTheDocument();
  });

  it("applies sx prop and forwarded className to the container", () => {
    const { container } = render(<ConnectWallet sx={{ ml: 3 }} />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.tagName.toLowerCase()).toBe("div");

    const rules = Array.from(document.styleSheets).flatMap((s) =>
      Array.from(s.cssRules || []).map((r) => r.cssText),
    );
    expect(
      rules.some(
        (rule) => rule.includes(el.className) && rule.includes("margin-left"),
      ),
    ).toBe(true);
  });

  it("renders large size variant with touch-friendly dimensions", () => {
    render(<ConnectWallet isScrolledTop={false} size="large" />);

    const button = screen.getByRole("button", { name: /connect wallet/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ minHeight: "44px" });
  });
});
