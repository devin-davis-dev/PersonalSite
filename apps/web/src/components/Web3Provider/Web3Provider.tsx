import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import type React from "react";
import { useColorMode } from "theme-ui";
import { WagmiProvider } from "wagmi";
import { queryClient, wagmiConfig } from "../../config/wagmi";
import { colors } from "../../theme/theme";
import ClientOnly from "../ClientOnly";

interface Web3ProviderProps {
  children: React.ReactNode;
}

const Web3ProviderClient: React.FC<Web3ProviderProps> = ({ children }) => {
  const [colorMode] = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    document.body.setAttribute("data-rk", "");
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            isDark
              ? darkTheme({
                  accentColor: colors.orange,
                  accentColorForeground: colors.primary,
                  borderRadius: "medium",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor: colors.orange,
                  accentColorForeground: colors.primary,
                  borderRadius: "medium",
                  overlayBlur: "small",
                })
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

/**
 * Universal Web3 Provider component.
 * Integrates Wagmi, React Query, and RainbowKit.
 * Safely guards against SSR execution using ClientOnly so Gatsby pre-rendering succeeds.
 */
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <ClientOnly fallback={children}>
      {() => <Web3ProviderClient>{children}</Web3ProviderClient>}
    </ClientOnly>
  );
};

export default Web3Provider;
