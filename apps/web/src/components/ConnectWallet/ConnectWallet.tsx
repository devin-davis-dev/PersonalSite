import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "gatsby-plugin-react-i18next";
import type React from "react";
import { Box, Button, Flex, Text, type ThemeUIStyleObject } from "theme-ui";
import ClientOnly from "../ClientOnly";

export interface ConnectWalletProps {
  /**
   * Optional Theme UI style overrides.
   */
  sx?: ThemeUIStyleObject;
  /**
   * Optional class name forwarded by Theme UI sx compilation.
   */
  className?: string;
  /**
   * Whether to display the account balance alongside the address.
   */
  showBalance?: boolean;
  /**
   * Whether the navbar is at the top of the page (dark header) or scrolled down (light header).
   * Defaults to true.
   */
  isScrolledTop?: boolean;
  /**
   * Size variant for the button.
   * "compact" (default) is suited for desktop headers.
   * "large" provides a larger, touch-friendly target for mobile menus.
   */
  size?: "compact" | "large";
}

const getNavTextColor = (isScrolledTop: boolean) =>
  isScrolledTop ? "white" : "primary";

const getHoverTextColor = (isScrolledTop: boolean) =>
  isScrolledTop ? "orange" : "darkOrange";

const pillBaseStyle: ThemeUIStyleObject = {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "body",
  fontWeight: "bold",
  borderRadius: "20px",
  cursor: "pointer",
  boxShadow: "none",
  bg: "transparent",
  border: "1px solid",
  transition: "all 0.2s ease-in-out",
};

const segmentBaseStyle: ThemeUIStyleObject = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  px: "9px",
  py: "4px",
  bg: "transparent",
  border: "none",
  cursor: "pointer",
  boxShadow: "none",
  fontSize: "0.75rem",
  transition: "all 0.2s ease-in-out",
};

const loadingPlaceholderStyle: ThemeUIStyleObject = {
  opacity: 0,
  pointerEvents: "none",
  userSelect: "none",
  minHeight: "28px",
};

interface DisconnectedButtonProps {
  isScrolledTop: boolean;
  size: "compact" | "large";
  onClick: () => void;
}

const DisconnectedButton: React.FC<DisconnectedButtonProps> = ({
  isScrolledTop,
  size,
  onClick,
}) => {
  const { t } = useTranslation("common");
  const isLarge = size === "large";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      sx={{
        ...pillBaseStyle,
        borderRadius: isLarge ? "24px" : "20px",
        gap: isLarge ? "8px" : "6px",
        fontSize: isLarge ? ["0.9375rem", "1rem"] : "0.8125rem",
        color: getNavTextColor(isScrolledTop),
        borderColor: isScrolledTop ? "white" : "primary",
        opacity: 0.85,
        px: isLarge ? "20px" : "12px",
        py: isLarge ? "10px" : "4px",
        minHeight: isLarge ? "44px" : "28px",
        "&:hover": {
          opacity: 1,
          borderColor: "orange",
          color: getHoverTextColor(isScrolledTop),
          bg: "lightOrange",
          boxShadow: "none",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "orange",
          outlineOffset: "2px",
        },
      }}
    >
      <Text
        as="span"
        sx={{
          fontSize: isLarge ? "1rem" : "0.8125rem",
          lineHeight: 1,
          color: "orange",
          opacity: 0.9,
        }}
      >
        ⟠
      </Text>
      <Text as="span">{t("wallet_connect")}</Text>
    </Button>
  );
};

interface WrongNetworkButtonProps {
  size: "compact" | "large";
  onClick: () => void;
}

const WrongNetworkButton: React.FC<WrongNetworkButtonProps> = ({
  size,
  onClick,
}) => {
  const { t } = useTranslation("common");
  const isLarge = size === "large";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      sx={{
        ...pillBaseStyle,
        borderRadius: isLarge ? "24px" : "20px",
        gap: isLarge ? "8px" : "5px",
        fontSize: isLarge ? ["0.9375rem", "1rem"] : "0.75rem",
        color: "error",
        borderColor: "error",
        px: isLarge ? "20px" : "10px",
        py: isLarge ? "10px" : "4px",
        minHeight: isLarge ? "44px" : "28px",
        opacity: 0.9,
        "&:hover": {
          opacity: 1,
          bg: "lightOrange",
          borderColor: "error",
          boxShadow: "none",
        },
      }}
    >
      <Text
        as="span"
        sx={{ fontSize: isLarge ? "1rem" : "0.75rem", fontWeight: "bold" }}
      >
        !
      </Text>
      <Text as="span">{t("wallet_wrong_network")}</Text>
    </Button>
  );
};

interface ConnectedBadgeProps {
  chain: { id: number; name?: string };
  account: { displayName: string; displayBalance?: string };
  showBalance: boolean;
  isScrolledTop: boolean;
  size: "compact" | "large";
  onOpenChain: () => void;
  onOpenAccount: () => void;
}

const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({
  chain,
  account,
  showBalance,
  isScrolledTop,
  size,
  onOpenChain,
  onOpenAccount,
}) => {
  const textColor = getNavTextColor(isScrolledTop);
  const isLarge = size === "large";

  return (
    <Flex
      sx={{
        alignItems: "center",
        borderRadius: isLarge ? "24px" : "20px",
        border: "1px solid",
        borderColor: isScrolledTop ? "white" : "primary",
        opacity: 0.9,
        backdropFilter: "blur(4px)",
        transition: "border-color 0.2s ease, opacity 0.2s ease",
        "&:hover": {
          borderColor: "orange",
          opacity: 1,
        },
      }}
    >
      {/* Network Segment */}
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenChain}
        sx={{
          ...segmentBaseStyle,
          fontSize: isLarge ? ["0.875rem", "0.9375rem"] : "0.75rem",
          px: isLarge ? "16px" : "9px",
          py: isLarge ? "10px" : "4px",
          minHeight: isLarge ? "44px" : "28px",
          color: textColor,
          borderRadius: isLarge ? "24px 0 0 24px" : "20px 0 0 20px",
          borderRight: "1px solid",
          borderRightColor: isScrolledTop ? "white" : "primary",
          fontWeight: "600",
          "&:hover": {
            bg: "lightOrange",
            boxShadow: "none",
          },
        }}
      >
        <Box
          sx={{
            width: isLarge ? "8px" : "6px",
            height: isLarge ? "8px" : "6px",
            borderRadius: "50%",
            bg: chain.id === 31337 ? "orange" : "success",
          }}
        />
        <Text>{chain.name}</Text>
        <Text sx={{ fontSize: isLarge ? "0.75rem" : "0.6rem", opacity: 0.6 }}>
          ▾
        </Text>
      </Button>

      {/* Account Segment */}
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenAccount}
        sx={{
          ...segmentBaseStyle,
          fontSize: isLarge ? ["0.875rem", "0.9375rem"] : "0.75rem",
          px: isLarge ? "16px" : "9px",
          py: isLarge ? "10px" : "4px",
          minHeight: isLarge ? "44px" : "28px",
          color: textColor,
          borderRadius: isLarge ? "0 24px 24px 0" : "0 20px 20px 0",
          fontFamily: "monospace",
          fontWeight: "bold",
          "&:hover": {
            bg: "lightOrange",
            color: getHoverTextColor(isScrolledTop),
            boxShadow: "none",
          },
        }}
      >
        <Text>{account.displayName}</Text>
        {showBalance && account.displayBalance && (
          <Text
            sx={{
              opacity: 0.7,
              fontSize: isLarge ? "0.8125rem" : "0.7rem",
              fontFamily: "body",
              fontWeight: "normal",
            }}
          >
            ({account.displayBalance})
          </Text>
        )}
      </Button>
    </Flex>
  );
};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  sx,
  className,
  showBalance = false,
  isScrolledTop = true,
  size = "compact",
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "body",
        fontSize: size === "large" ? ["0.9375rem", "1rem"] : "0.8125rem",
        ...sx,
      }}
    >
      <ClientOnly
        fallback={
          <Box sx={{ minHeight: size === "large" ? "44px" : "28px" }} />
        }
      >
        {() => (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              if (!ready) {
                return (
                  <Box
                    aria-hidden={true}
                    sx={{
                      ...loadingPlaceholderStyle,
                      minHeight: size === "large" ? "44px" : "28px",
                    }}
                  />
                );
              }

              if (!connected) {
                return (
                  <DisconnectedButton
                    isScrolledTop={isScrolledTop}
                    size={size}
                    onClick={openConnectModal}
                  />
                );
              }

              if (chain.unsupported) {
                return (
                  <WrongNetworkButton size={size} onClick={openChainModal} />
                );
              }

              return (
                <ConnectedBadge
                  chain={chain}
                  account={account}
                  showBalance={showBalance}
                  isScrolledTop={isScrolledTop}
                  size={size}
                  onOpenChain={openChainModal}
                  onOpenAccount={openAccountModal}
                />
              );
            }}
          </ConnectButton.Custom>
        )}
      </ClientOnly>
    </Box>
  );
};

export default ConnectWallet;
