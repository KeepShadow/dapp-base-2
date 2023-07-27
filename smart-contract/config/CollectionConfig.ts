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
  contractName: "DeadBirds",
  tokenName: "DeadBirds",
  tokenSymbol: "DDB",
  hiddenMetadataUri: "ipfs://bafkreiaseybgawhjot4qbktsr63grqklalkdxxy2gk4ihrv6mbsfctoojy",
  maxSupply: 2222,
  whitelistSale: {
    price: 0.5,
    maxMintAmountPerTx: 58,
    whitelistSupply: 2222
  },
  preSale: {
    price: 0.5,
    maxMintAmountPerTx: 1,
  },
  publicSale: {
    price: 0.5,
    maxMintAmountPerTx: 1,
  },
  contractAddress: "0x0aAD434F1d76058eDDF751261f99537bDa224470",
  walletConnectProjectId: "665d687852032cfc7d1c167792f3c74b",
  marketplaceIdentifier: "deadbirdsofficial",
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
  royaltyReceiver: "0x4af9CA5Fd841D2B04c59cf38290891ceEE9b8981",
  royaltyNumerator: "1000",
  treasury: "0xc2E5ba835c571a5f2306C31f961DF73D379eaEFe",
};

export default CollectionConfig;
