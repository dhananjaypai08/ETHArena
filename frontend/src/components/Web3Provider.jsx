import {useState, useEffect} from 'react';
import { WagmiProvider, createConfig, http } from "wagmi";
// import { polygonZkEvmCardona } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const baseSepolia = {
  id: 84532,
  name: "Base Sepolia Testnet",
  nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18},
  rpcUrls: {
    default: { http : ["https://rpc.ankr.com/base_sepolia"] }
  },
  blockExplorers: {
    default: { name: 'Base Sepolia Testnet Explorer', url: "https://sepolia-explorer.base.org" }
  },
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [baseSepolia],
    // transports: {
    //   // RPC URL for each chain
    //   [polygonZkEvmCardona.id]: http(
    //     `https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public`,
    //   ),
    // },

    // Required API Keys
    walletConnectProjectId: "a7a2557c75d9558a9c932d5f99559799",

    // Required App Info
    appName: "DJWallet",

    // Optional App Info
    appDescription: "BaseArena",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>

            {children}
          
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};