'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';

type Chain = 'base' | 'solana';

export default function Providers({ children }: { children: React.ReactNode }) {
  const chain = (process.env.NEXT_PUBLIC_CHAIN as Chain) || 'base';

  if (chain === 'solana') {
    return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email', 'wallet', 'google', 'twitter'],
          appearance: {
            theme: 'dark',
            accentColor: '#ff7a66',
            walletChainType: 'solana-only',
          },
          embeddedWallets: {
            solana: {
              createOnLogin: 'users-without-wallets',
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    );
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'dark',
          accentColor: '#ff7a66',
        },
        defaultChain: base,
        supportedChains: [base],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

// NEXT_PUBLIC_CHAIN=base
// # or
// # NEXT_PUBLIC_CHAIN=solana
