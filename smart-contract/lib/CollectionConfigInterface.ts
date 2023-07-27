import NetworkConfigInterface from "../lib/NetworkConfigInterface";
import MarketplaceConfigInterface from "../lib/MarketplaceConfigInterface";

interface SaleConfig {
  price: number;
  maxMintAmountPerTx: number;
}

interface WhitelistSaleConfig {
  price: number;
  maxMintAmountPerTx: number;
  whitelistSupply: number
}

export default interface CollectionConfigInterface {
  testnet: NetworkConfigInterface;
  mainnet: NetworkConfigInterface;
  contractName: string;
  tokenName: string;
  tokenSymbol: string;
  hiddenMetadataUri: string;
  maxSupply: number;
  whitelistSale: WhitelistSaleConfig;
  preSale: SaleConfig;
  publicSale: SaleConfig;
  contractAddress: string | null;
  walletConnectProjectId: string | null;
  marketplaceIdentifier: string;
  marketplaceConfig: MarketplaceConfigInterface;
  whitelistAddresses: string[];
  royaltyReceiver: string | null;
  royaltyNumerator: string | null;
  treasury: string | null;
}
