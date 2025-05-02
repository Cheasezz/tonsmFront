<script setup lang="ts">
import { computed } from 'vue'
import { TonConnectButton, useTonWallet } from '@/tonconnect'
import AppDisplayData, { type DisplayDataRow } from '@/components/AppDisplayData.vue'
import AppLink from '@/components/AppLink.vue'
import AppPage from '@/components/AppPage.vue'
import { useMainContract } from '@/contracts/useMainContract'
import { useTonConnect } from '@/tonconnect/useTonConnect'

const { wallet } = useTonWallet()

const walletExtended = computed(() => {
  return wallet.value && 'imageUrl' in wallet.value ? wallet.value : null
})

const rows = computed<DisplayDataRow[]>(() => {
  return wallet.value
    ? [
        { title: 'Address', value: wallet.value.account.address },
        { title: 'Chain', value: wallet.value.account.chain },
        { title: 'Public Key', value: wallet.value.account.publicKey },
      ]
    : []
})

const {
  contract_address,
  contract_balance,
  counter_value,
  owner_address,
  recent_sender,
  sendIncrement,
  sendDeposit,
  sendWithdrawalRequest,
} = useMainContract()

const { connected } = useTonConnect()
</script>

<template>
  <AppPage title="TON Connect">
    <p v-if="!wallet">
      To display the data related to the TON Connect, it is required to connect your wallet.
    </p>
    <template v-else>
      <div v-if="walletExtended" class="ton-connect-page__provider">
        <img
          class="ton-connect-page__provider-image"
          :src="walletExtended.imageUrl"
          alt="Provider logo"
          width="60"
          height="60"
        />
        <div class="ton-connect-page__provider-meta">
          <p class="ton-connect-page__provider-wallet-name">
            {{ walletExtended.name }}&nbsp;
            <span class="ton-connect-page__provider-app-name">
              {{ walletExtended.appName }}
            </span>
          </p>
          <AppLink :to="walletExtended.aboutUrl"> About connected wallet </AppLink>
        </div>
      </div>
      <AppDisplayData :rows />
    </template>
    <div class="ton-connect-page__button-container">
      <TonConnectButton />
    </div>

    <div>
      <div class="Card">
        <b>Our contract Address</b>
        <div class="Hint">{{ contract_address?.slice(0, 30) + '...' }}</div>
        <b>Our contract balance</b>
        <div class="Hint">{{ contract_balance }}</div>
      </div>

      <div class="Card">
        <b>Counter value</b>
        <div>{{ counter_value ?? 'Loading...' }}</div>
      </div>

      <button v-if="connected" @click="sendIncrement">Увеличить счетчик на 5 за 0.06 TON</button>
      <br />
      <button v-if="connected" @click="sendDeposit">Внести 0.03 TON</button>
      <br />
      <button v-if="connected" @click="sendWithdrawalRequest">Вывести 0.04 TON</button>
    </div>
  </AppPage>
</template>

<style scoped>
.ton-connect-page__button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ton-connect-page__provider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 16px;
}

.ton-connect-page__provider-image {
  border-radius: 5px;
}

.ton-connect-page__provider-meta {
  display: flex;
  flex-direction: column;
}

.ton-connect-page__provider-wallet-name {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
}

.ton-connect-page__provider-app-name {
  opacity: 0.4;
  font-weight: 400;
  font-size: 14px;
  vertical-align: top;
}
</style>
