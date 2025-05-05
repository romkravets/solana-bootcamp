import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const UserTokensTab = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    const fetchTokens = async () => {
      setLoading(true);
      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const accounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program
          }
        );
        const tokenList = accounts.value.map((accountInfo) => {
          const info = accountInfo.account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals,
          };
        });
        setTokens(tokenList);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  if (!publicKey) return <p className="text-center">Connect your wallet</p>;
  if (loading) return <p className="text-center">Loading tokens...</p>;

  return (
    <div className="space-y-4 mt-4">
      {tokens.length === 0 ? (
        <p className="text-center">No tokens found</p>
      ) : (
        <ul className="space-y-2">
          {tokens.map((token, index) => (
            <li
              key={index}
              className="p-4 rounded border shadow-sm flex justify-between"
            >
              <span>Mint: {token.mint}</span>
              <span>Amount: {token.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTokensTab;
