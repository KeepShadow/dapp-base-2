<template>
  <div id="minting-dapp" class="preview">
    <div class="sidebar">
      <ul>
        <li>
          <img src="../assets/nft_1.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_2.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_3.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_4.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_5.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_6.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_1.jpg" alt="Hanzo Nft Collection">
        </li>
        <li>
          <img src="../assets/nft_2.jpg" alt="Hanzo Nft Collection">
        </li>
      </ul>
    </div>
    <img id="logo" src="../assets/plain_typo.png" alt="Logo Hanzo" />

    <div v-if="Web3.isNotMainnet" class="alert alert-warning" role="alert">
      You are not connected to Polygon Mainnet. <span class="small">Current network: <strong>{{Web3.network?.name}}</strong></span>
    </div>

    <div v-if="Web3.errorMessage" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ Web3.errorMessage }}
      <button @click="Web3.setError()" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>

    <template v-if="Web3.isWalletConnected && Web3.isContractReady">
      <div class="containerMintStatus">
        <collection-status />
        <mint-widget v-if="!Web3.isSoldOut"/>
        <div v-else>
          <h2>Collection is <strong>sold out</strong>! <span class="emoji">🥳</span></h2>
          You can buy from our beloved holders on <a :href="Web3.generateMarketplaceUrl" target="_blank">{{Web3.marketPlaceName}}</a>.
        </div>
      </div>
    </template>

    <div v-if="!Web3.isContractReady" class="collection-not-ready">
      <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      Loading collection data...
    </div>

    <div v-else-if="!Web3.isWalletConnected" class="no-wallet">
      <button class="connectButton" @click="Web3.connectWallet">Connect Wallet</button>
    </div>
    <div v-else-if="Web3.isWalletConnected" class="walletTop">
      <button class="connectButton" @click="Web3.connectWallet"></button>
    </div>
    <div class="socialLinks">
      <ul>
        <li>
          <a href="https://twitter.com/LegendOfHanzo" target="_blank">
            <img src="../assets/icon_twitter.png" alt="hanzo twitter">
          </a>
        </li>
        <li>
          <a href="https://t.me/hanzommorpg" target="_blank">
            <img src="../assets/icon_tg.png" alt="hanzo telegram">
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import CollectionStatus from '@/components/CollectionStatus.vue'
import MintWidget from '@/components/MintWidget.vue'
import { useWeb3 } from '@/store/Web3'

const Web3 = useWeb3()
const merkleProofManualAddress = ref('')
watch(() => Web3.userAddress, (userAddress) => {
  if (!merkleProofManualAddress.value && userAddress) {
    merkleProofManualAddress.value = userAddress?.toString()
  }
})
</script>
