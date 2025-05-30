// import React, { useEffect, useState } from "react";
// import {
//   Connection,
//   PublicKey,
//   clusterApiUrl,
// } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// interface TokenAccount {
//   mint: string;
//   amount: number;
// }

// const UserTokensTab: React.FC = () => {
//   const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);

//   useEffect(() => {
//     const fetchTokenAccounts = async () => {
//       try {
//         const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

//         const walletPublicKey = new PublicKey("GStMBjSMRU8n96KT5aXRexbn5dwrQPDg3PwZ39ydHDy4");

//         const accounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
//           programId: TOKEN_PROGRAM_ID,
//         });

//         console.log("Token accounts found:", accounts.value.length);

//         const tokens: TokenAccount[] = accounts.value.map(({ account }) => {
//           const info = account.data.parsed.info;
//           return {
//             mint: info.mint,
//             amount: info.tokenAmount.uiAmount,
//           };
//         });

//         setTokenAccounts(tokens);
//       } catch (error) {
//         console.error("Error fetching token accounts:", error);
//       }
//     };

//     fetchTokenAccounts();
//   }, []);

//   return (
//     <div>
//       <h2>User Token Accounts</h2>
//       {tokenAccounts.length === 0 ? (
//         <p>No tokens found.</p>
//       ) : (
//         <ul>
//           {tokenAccounts.map((token, index) => (
//             <li key={index}>
//               Mint: {token.mint} — Amount: {token.amount}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserTokensTab;

import React, { useEffect, useState } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';

const MintTab = () => {
  const [walletPublicKey, setWalletPublicKey] = useState(null);
  const [mintAddress, setMintAddress] = useState("9kkDFUJcayu4PVkhH9GM5EiDCVWpj6bbiWyVZfb6dXuG");
  const [connection, setConnection] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);

  const onConnectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        const publicKey = response.publicKey;
        setWalletPublicKey(publicKey);
      } catch (err) {
        console.error('Connection to Phantom failed:', err);
      }
    } else {
      alert("Please install Phantom wallet.");
    }
  };

  useEffect(() => {
    // Initialize connection to Solana devnet
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    setConnection(connection);

    // Fetch account info for mint address when wallet is connected
    if (walletPublicKey) {
      const getAccountInfo = async () => {
        const accountInfo = await connection.getParsedAccountInfo(walletPublicKey);
        setAccountInfo(accountInfo);
      };
      getAccountInfo();
    }
  }, [walletPublicKey]);

  return (
    <div>
      <button onClick={onConnectWallet}>
        Connect Phantom Wallet
      </button>

      {walletPublicKey && (
        <div>
          <h3>Connected Wallet:</h3>
          <p>{walletPublicKey.toString()}</p>
        </div>
      )}

      <div>
        <h3>Mint Address:</h3>
        <p>{mintAddress}</p>
      </div>

      {accountInfo && (
        <div>
          <h3>Account Info:</h3>
          <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MintTab;

