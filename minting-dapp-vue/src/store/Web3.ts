import { defineStore } from 'pinia'

import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig, getContract, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
import { polygonMumbai } from '@wagmi/core/chains'
/* import { publicProvider } from '@wagmi/core/providers/public' */
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { toast } from 'vue3-toastify'

import NetworkConfigInterface from '../../../smart-contract/lib/NetworkConfigInterface'
import CollectionConfig from '../../../smart-contract/config/CollectionConfig'
/* import Whitelist from '../scripts/lib/Whitelist' */
import Whitelist from '../scripts/lib/Whitelist2'

import { infectedDalmatianABI } from '../generated'

interface Network {
  name: string,
  chainId: number
}

interface State {
  contract: any,
  initDone: boolean,
  userAddress: `0x${string}`|null|undefined;
  network: Network|null;
  networkConfig: NetworkConfigInterface;
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: bigint;
  isPaused: boolean;
  loading: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  amountAllowed: number;
  alreadyMintedAmount: number;
  merkleProofManualAddressStatus: boolean|null;
  errorMessage: string|JSX.Element|null;
}

const defaultState: State = {
  contract: null,
  initDone: false,
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.testnet, /*    //HERE */
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigInt(0),
  isPaused: true,
  loading: false,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  amountAllowed: 0,
  alreadyMintedAmount: 0,
  merkleProofManualAddressStatus: null,
  errorMessage: null
}

const projectId = CollectionConfig.walletConnectProjectId as string

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://rpc-mumbai.maticvigil.com/'
      })
    })
  ]
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  // publicClient
  publicClient,
  webSocketPublicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)

const contractConf = {
  address: CollectionConfig.contractAddress as `0x${string}`,
  abi: infectedDalmatianABI
}

export const useWeb3 = defineStore('Web3', {
  state: () => defaultState,
  actions: {
    async init () {
      console.log('Web3 init start2')
      console.log(Whitelist.getRoot())
      this.registerWalletEvents()

      this.contract = getContract({
        ...contractConf,
        walletClient: ethereumClient
      })

      setTimeout(() => {
        console.log(this.contract)
      }, 2000)

      console.log({ chains, publicClient, webSocketPublicClient })
      console.log('teste')

      this.$patch({
        maxSupply: Number(await this.contract.read.maxSupply()),
        totalSupply: Number(await this.contract.read.totalSupply([])),
        maxMintAmountPerTx: Number(await this.contract.read.maxMintAmountPerTx([])),
        tokenPrice: await this.contract.read.cost([]),
        isPaused: await this.contract.read.paused([]),
        isWhitelistMintEnabled: await this.contract.read.whitelistMintEnabled([]),
        isUserInWhitelist: Whitelist.contains(this.userAddress ?? ''),
        amountAllowed: Whitelist.getAmountAllowed(this.userAddress ?? ''),
        alreadyMintedAmount: await this.contract.read.alreadyMinted([this.userAddress ?? ''])
      })

      this.initDone = true
    },
    async registerWalletEvents () {
      ethereumClient.watchAccount(({ isConnected, address }) => {
        // console.log('ACCOUNT EVENT', isConnected, address)
        if (isConnected) {
          this.userAddress = address
          /* console.log(Whitelist.getProofForAddress(this.userAddress!) as `0x${string}`[]) */
        } else {
          this.userAddress = null
        }
      })
      ethereumClient.watchNetwork(({ chain }) => {
        // console.log('NET EV', chain)
        if (chain) {
          this.network = {
            name: chain.name,
            chainId: chain.id
          }
        } else {
          this.network = null
        }
      })
    },
    setError (error: any = null) {
      let errorMessage = 'Unknown error...'

      /*
      console.log('HANDLE ERROR', typeof error, JSON.stringify(error, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
      ))
      */

      if (error === null || typeof error === 'string') {
        errorMessage = error
      } else if (typeof error === 'object') {
        // Support any type of error from the Web3 Provider...
        if (error?.details) {
          errorMessage = error.details
        } else if (error?.error?.message !== undefined) {
          errorMessage = error.error.message
        } else if (error?.data?.message !== undefined) {
          errorMessage = error.data.message
        } else if (error?.message !== undefined) {
          errorMessage = error.message
        }
      }

      this.errorMessage = errorMessage === null ? null : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
    },
    async connectWallet () {
      await web3modal.openModal()
    },
    copyMerkleProofToClipboard (merkleProofManualAddress: string): void {
      const merkleProof = Whitelist.getRawProofForAddress(merkleProofManualAddress)

      if (merkleProof.length < 1) {
        this.merkleProofManualAddressStatus = false
        return
      }

      navigator.clipboard.writeText(merkleProof)
      this.merkleProofManualAddressStatus = true
    },
    async handleTransaction (request: any) {
      const { hash } = await writeContract(request)

      toast.info(`
        <p>Transaction sent! Please wait...</p>
        <a href=${this.generateTransactionUrl(hash)} target="_blank" rel="noopener">View on ${this.networkConfig.blockExplorer.name}</a>
      `, {
        dangerouslyHTMLString: true,
        position: 'bottom-center'
      })

      await waitForTransaction({ hash })

      this.totalSupply = Number(await this.contract.read.totalSupply([]))
      this.alreadyMintedAmount = await this.contract.read.alreadyMinted([this.userAddress ?? ''])

      toast.info(`
        <p>Success!</p>
        <a href=${this.generateTransactionUrl(hash)} target="_blank" rel="noopener">View on ${this.networkConfig.blockExplorer.name}</a>
      `, {
        dangerouslyHTMLString: true,
        position: 'bottom-center'
      })
    },
    async mintTokens (amount: number): Promise<void> {
      try {
        this.loading = true
        const value = this.tokenPrice * BigInt(amount)
        const { request } = await prepareWriteContract({
          ...contractConf,
          functionName: 'mint',
          args: [BigInt(amount)],
          value
        })

        await this.handleTransaction(request)

        this.loading = false
      } catch (e) {
        this.setError(e)
        this.loading = false
      }
    },
    async whitelistMintTokens (amount: number): Promise<void> {
      try {
        this.loading = true
        const value = this.tokenPrice * BigInt(amount)
        const { request } = await prepareWriteContract({
          ...contractConf,
          functionName: 'whitelistMint',
          args: [BigInt(this.amountAllowed), Whitelist.getProofForAddress(this.userAddress!) as `0x${string}`[], BigInt(amount)],
          value
        })

        await this.handleTransaction(request)

        this.loading = false
      } catch (e) {
        this.setError(e)
        this.loading = false
      }
    }
  },
  getters: {
    getUserAddress (): `0x${string}`|null|undefined {
      return this.userAddress
    },
    isWalletConnected (): boolean {
      return !!this.userAddress
    },
    isContractReady (): boolean {
      return this.contract !== undefined && this.initDone
    },
    isSoldOut (): boolean {
      return this.maxSupply !== 0 && this.totalSupply >= this.maxSupply
    },
    isNotMainnet (): boolean {
      return this.network !== null && this.network.chainId !== CollectionConfig.mainnet.chainId
    },
    generateContractUrl (): string {
      return this.networkConfig.blockExplorer.generateContractUrl(CollectionConfig.contractAddress!)
    },
    generateMarketplaceUrl (): string {
      return CollectionConfig.marketplaceConfig.generateCollectionUrl(CollectionConfig.marketplaceIdentifier, !this.isNotMainnet)
    },
    generateTransactionUrl (state): (arg0: any) => string {
      return (transactionHash: any) => state.networkConfig.blockExplorer.generateTransactionUrl(transactionHash)
    },
    marketPlaceName (): string {
      return CollectionConfig.marketplaceConfig.name
    }
  }
})
