import CollectionConfigInterface from "../lib/CollectionConfigInterface";
import * as Networks from "../lib/Networks";
import * as Marketplaces from "../lib/Marketplaces";
import whitelistAddresses from "./whitelist.json";

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.polygonTestnet,
  mainnet: Networks.polygonMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: "InfectedDalmatian",
  tokenName: "InfectedDalmatian",
  tokenSymbol: "INF",
  hiddenMetadataUri: "",
  maxSupply: 5000,
  whitelistSale: {
    price: 0.000001,
    maxMintAmountPerTx: 300,
    whitelistSupply: 1500
  },
  preSale: {
    price: 100,
    maxMintAmountPerTx: 0,
  },
  publicSale: {
    price: 0.06,
    maxMintAmountPerTx: 50,
  },
  contractAddress: "0xD8F95DFBa0a1a668697Fb62BfE1D484ED277493b",
  walletConnectProjectId: "54b86bafe334a726226e97077e25c877",
  marketplaceIdentifier: "hanzo-avatars",
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
  royaltyReceiver: "0xC5EBdd487fF97ce2698b69cc09EF0BEfdE476944",
  royaltyNumerator: "1000",
  treasury: "0xC5EBdd487fF97ce2698b69cc09EF0BEfdE476944",
};

export default CollectionConfig;
