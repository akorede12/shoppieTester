import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, } from "@rainbow-me/rainbowkit";
import {chain, configureChains, createClient, WagmiConfig, defaultChains } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, polygonMumbai, localhost, hardhat} from 'wagmi/chains'
// import {mainnet, polygon, optimism, arbitrum} from 'wagmi/chains';
import {alchemyProvider} from 'wagmi/providers/alchemy';
import {publicProvider} from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [ mainnet, polygon, arbitrum, optimism, polygonMumbai, localhost, hardhat],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID}),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'shoppietester',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  return (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
    <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>
  );
};

export default MyApp
