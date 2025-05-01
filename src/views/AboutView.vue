<script setup lang="ts">
import { useMainContract } from '@/contracts/useMainContract'
import TonConnectButton from '@/tonconnect/TonConnectButton.vue'
import { useTonConnect } from '@/tonconnect/useTonConnect'

const {
  contract_address,
  contract_balance,
  counter_value,
  owner_address,
  recent_sender,
  sendIncrement,
  sendDeposit,
  sendWithdrawalRequest
} = useMainContract()

const { connected } = useTonConnect()
</script>

<template>
  <div class="about">
    <TonConnectButton />
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
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
