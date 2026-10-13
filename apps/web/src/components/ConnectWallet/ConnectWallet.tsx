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
  onClick: () => void;
}

const DisconnectedButton: React.FC<DisconnectedButtonProps> = ({
  isScrolledTop,
  onClick,
}) => {
  const { t } = useTranslation("common");

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      sx={{
        ...pillBaseStyle,
        gap: "6px",
        fontSize: "0.8125rem",
        color: getNavTextColor(isScrolledTop),
        borderColor: isScrolledTop ? "white" : "primary",
        opacity: 0.85,
        px: "12px",
        py: "4px",
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
          fontSize: "0.8125rem",
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
  onClick: () => void;
}

const WrongNetworkButton: React.FC<WrongNetworkButtonProps> = ({ onClick }) => {
  const { t } = useTranslation("common");

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      sx={{
        ...pillBaseStyle,
        gap: "5px",
        fontSize: "0.75rem",
        color: "error",
        borderColor: "error",
        px: "10px",
        py: "4px",
        opacity: 0.9,
        "&:hover": {
          opacity: 1,
          bg: "lightOrange",
          borderColor: "error",
          boxShadow: "none",
        },
      }}
    >
      <Text as="span" sx={{ fontSize: "0.75rem" }}>
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
  onOpenChain: () => void;
  onOpenAccount: () => void;
}

const ConnectedBadge: React.FC<ConnectedBadgeProps> = ({
  chain,
  account,
  showBalance,
  isScrolledTop,
  onOpenChain,
  onOpenAccount,
}) => {
  const textColor = getNavTextColor(isScrolledTop);

  return (
    <Flex
      sx={{
        alignItems: "center",
        borderRadius: "20px",
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
          color: textColor,
          borderRadius: "20px 0 0 20px",
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
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            bg: chain.id === 31337 ? "orange" : "success",
          }}
        />
        <Text>{chain.name}</Text>
        <Text sx={{ fontSize: "0.6rem", opacity: 0.6 }}>▾</Text>
      </Button>

      {/* Account Segment */}
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenAccount}
        sx={{
          ...segmentBaseStyle,
          color: textColor,
          borderRadius: "0 20px 20px 0",
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
              fontSize: "0.7rem",
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
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "body",
        fontSize: "0.8125rem",
        ...sx,
      }}
    >
      <ClientOnly fallback={<Box sx={{ minHeight: "28px" }} />}>
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
                return <Box aria-hidden={true} sx={loadingPlaceholderStyle} />;
              }

              if (!connected) {
                return (
                  <DisconnectedButton
                    isScrolledTop={isScrolledTop}
                    onClick={openConnectModal}
                  />
                );
              }

              if (chain.unsupported) {
                return <WrongNetworkButton onClick={openChainModal} />;
              }

              return (
                <ConnectedBadge
                  chain={chain}
                  account={account}
                  showBalance={showBalance}
                  isScrolledTop={isScrolledTop}
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
