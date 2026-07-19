// src/main.jsx
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const Root = () => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = 'https://api.devnet.solana.com';

  const wallets = useMemo(() => [], []);

  return (
    <React.StrictMode>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <App />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);