import { PropsWithChildren, useMemo } from "react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";

const queryClient = new QueryClient();

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint =  useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [
    new PhantomWalletAdapter()
  ], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WalletModalProvider>
    </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
