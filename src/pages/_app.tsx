import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

const chains = [mainnet, polygon]
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    new CoinbaseWalletConnector({
      chains, options: { appName: "WalletConnect Test" }
    })
  ],
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient}   walletImages={{
    // Override wagmi connector image (refer to wagmi to find id)
    coinbaseWallet: 'coinbase-wallet-logo.svg',
  }}/>
  </>
  )
}
