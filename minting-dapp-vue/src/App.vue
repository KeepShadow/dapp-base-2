<template>
  <router-view/>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { useWeb3 } from '@/store/Web3'
import './styles/main.scss'
import 'vue3-toastify/dist/index.css'

export default class HomeView extends Vue {
  Web3 = useWeb3()

  mounted () {
    this.Web3.init()
  }
}
</script>

<style>
</style>
