import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { hardhat, sepolia } from "wagmi/chains";

/**
 * Singleton QueryClient for TanStack React Query.
 * Shared across the app for caching Web3 RPC reads and wallet states.
 */
export const queryClient = new QueryClient();

/**
 * Wagmi configuration configured with RainbowKit's getDefaultConfig.
 * Supports Hardhat local node (Chain ID 31337) and Sepolia testnet (Chain ID 11155111).
 */
export const wagmiConfig = getDefaultConfig({
  appName: "Devin Davis Portfolio",
  projectId:
    process.env.GATSBY_WALLETCONNECT_PROJECT_ID ||
    "00000000000000000000000000000000",
  chains: [hardhat, sepolia],
  ssr: false,
});
