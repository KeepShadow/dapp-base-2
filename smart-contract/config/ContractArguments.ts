import { utils } from 'ethers';
import CollectionConfig from './CollectionConfig';

// Update the following array if you change the constructor arguments...
const ContractArguments = [
  CollectionConfig.tokenName,
  CollectionConfig.tokenSymbol,
  utils.parseEther(CollectionConfig.whitelistSale.price.toString()),
  CollectionConfig.maxSupply,
  CollectionConfig.whitelistSale.whitelistSupply,
  CollectionConfig.whitelistSale.maxMintAmountPerTx,
  CollectionConfig.hiddenMetadataUri,
  CollectionConfig.royaltyReceiver,
  CollectionConfig.royaltyNumerator,
  CollectionConfig.treasury,
] as const;

export default ContractArguments;
