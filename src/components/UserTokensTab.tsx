import React, { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface TokenAccount {
  mint: string;
  amount: number;
}

const UserTokensTab: React.FC = () => {
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const walletPublicKey = new PublicKey("GStMBjSMRU8n96KT5aXRexbn5dwrQPDg3PwZ39ydHDy4");

        const accounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        console.log("Token accounts found:", accounts.value.length);

        const tokens: TokenAccount[] = accounts.value.map(({ account }) => {
          const info = account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
          };
        });

        setTokenAccounts(tokens);
      } catch (error) {
        console.error("Error fetching token accounts:", error);
      }
    };

    fetchTokenAccounts();
  }, []);

  return (
    <div>
      <h2>User Token Accounts</h2>
      {tokenAccounts.length === 0 ? (
        <p>No tokens found.</p>
      ) : (
        <ul>
          {tokenAccounts.map((token, index) => (
            <li key={index}>
              Mint: {token.mint} — Amount: {token.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTokensTab;
