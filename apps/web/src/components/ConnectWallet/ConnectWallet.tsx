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

/**
 * Subtle minimalist ConnectWallet button styled to blend seamlessly with the site navigation,
 * supporting dark and light navbar states, bilingual i18n, and Theme UI.
 */
export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  sx,
  className,
  showBalance = false,
  isScrolledTop = true,
}) => {
  const { t } = useTranslation("common");

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
                return (
                  <Box
                    aria-hidden={true}
                    sx={{
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                      minHeight: "28px",
                    }}
                  />
                );
              }

              // State 1: Disconnected (Subtle outline pill button)
              if (!connected) {
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={openConnectModal}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "body",
                      fontWeight: "bold",
                      fontSize: "0.8125rem",
                      color: isScrolledTop ? "white" : "#30362F",
                      bg: "transparent",
                      border: "1px solid",
                      borderColor: isScrolledTop
                        ? "rgba(255, 255, 255, 0.28)"
                        : "rgba(48, 54, 47, 0.24)",
                      borderRadius: "20px",
                      px: "12px",
                      py: "4px",
                      cursor: "pointer",
                      boxShadow: "none",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "orange",
                        color: isScrolledTop ? "orange" : "darkOrange",
                        bg: isScrolledTop
                          ? "rgba(255, 166, 48, 0.12)"
                          : "rgba(255, 166, 48, 0.08)",
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
              }

              // State 2: Wrong Network Warning (Subtle alert pill)
              if (chain.unsupported) {
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={openChainModal}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontFamily: "body",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      color: isScrolledTop ? "#ff8080" : "#c53030",
                      bg: "rgba(229, 62, 62, 0.08)",
                      border: "1px solid rgba(229, 62, 62, 0.35)",
                      borderRadius: "20px",
                      px: "10px",
                      py: "4px",
                      cursor: "pointer",
                      boxShadow: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bg: "rgba(229, 62, 62, 0.16)",
                        borderColor: "#E53E3E",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <Text as="span" sx={{ fontSize: "0.75rem" }}>
                      ⚠️
                    </Text>
                    <Text as="span">{t("wallet_wrong_network")}</Text>
                  </Button>
                );
              }

              // State 3: Connected (Subtle translucent glass badge)
              return (
                <Flex
                  sx={{
                    alignItems: "center",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: isScrolledTop
                      ? "rgba(255, 255, 255, 0.22)"
                      : "rgba(48, 54, 47, 0.2)",
                    bg: isScrolledTop
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.03)",
                    backdropFilter: "blur(4px)",
                    transition:
                      "border-color 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                      borderColor: "orange",
                    },
                  }}
                >
                  {/* Left Segment: Network */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={openChainModal}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      px: "9px",
                      py: "4px",
                      bg: "transparent",
                      color: isScrolledTop ? "white" : "#30362F",
                      borderRadius: "20px 0 0 20px",
                      border: "none",
                      borderRight: "1px solid",
                      borderRightColor: isScrolledTop
                        ? "rgba(255, 255, 255, 0.15)"
                        : "rgba(48, 54, 47, 0.15)",
                      cursor: "pointer",
                      boxShadow: "none",
                      fontFamily: "body",
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      transition:
                        "background-color 0.2s ease, opacity 0.2s ease",
                      "&:hover": {
                        bg: isScrolledTop
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.05)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {/* Status dot */}
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        bg: chain.id === 31337 ? "#FFA630" : "#4CAF50",
                      }}
                    />
                    <Text>{chain.name}</Text>
                    <Text sx={{ fontSize: "0.6rem", opacity: 0.6 }}>▾</Text>
                  </Button>

                  {/* Right Segment: Account & Balance */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={openAccountModal}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      px: "9px",
                      py: "4px",
                      bg: "transparent",
                      color: isScrolledTop ? "white" : "#30362F",
                      borderRadius: "0 20px 20px 0",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "none",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                      "&:hover": {
                        bg: isScrolledTop
                          ? "rgba(255, 166, 48, 0.12)"
                          : "rgba(255, 166, 48, 0.08)",
                        color: isScrolledTop ? "orange" : "darkOrange",
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
            }}
          </ConnectButton.Custom>
        )}
      </ClientOnly>
    </Box>
  );
};

export default ConnectWallet;
