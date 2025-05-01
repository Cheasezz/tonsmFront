import { useAsyncInitialize } from '@/tonconnect/useAsyncInit'
import { useTonClient } from '@/tonconnect/useTonClient'
import { Address, fromNano, toNano, type OpenedContract } from '@ton/core'
import { computed, onUnmounted, ref, watch } from 'vue'
import { MainContract } from './MainContract'
import { useTonConnect } from '@/tonconnect/useTonConnect'

export function useMainContract() {
  const client = useTonClient()
  const { sender } = useTonConnect()

  // const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
  let pollingTimeout: NodeJS.Timeout | null = null
  const isPollingActive = ref(true)
  // const currentInterval = ref(5000)

  const contractData = ref<{
    counter_value: number
    recent_sender: Address
    owner_address: Address
  } | null>(null)

  const balance = ref<string | null>('')

  const mainContract = useAsyncInitialize(async () => {
    if (!client.value) return
    const contract = new MainContract(
      Address.parse('EQCducASx_0SL53_6m8znA82mCZFxgoVSwZ5PjfxX4yTZqZN'),
    )
    return client.value?.open(contract) as OpenedContract<MainContract>
  })

  async function getContractValue() {
    if (!mainContract.value) return
    try {
      contractData.value = null
      const val = await mainContract.value.getData()
      balance.value = fromNano((await mainContract.value.getBalance()).balance)
      contractData.value = {
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      }
    } catch (error) {
      console.log('Polling errorrr: ', error)
    } finally {
      // recursive only if poling is active
      if (isPollingActive.value) {
        pollingTimeout = setTimeout(poll, 5000) // Интервал 5 сек
      }
    }
    // await sleep(5000)
    // getContractValue()
  }

  function poll() {
    if (!isPollingActive.value) return
    getContractValue() // Запускаем цепочку
  }

  // function startPolling(interval = 5000) {
  //   if (isPollingActive.value) return
  //   isPollingActive.value = true
  //   poll() // Первый запуск
  // }

  function stopPolling() {
    isPollingActive.value = false
    if (pollingTimeout) {
      clearTimeout(pollingTimeout)
      pollingTimeout = null
    }
  }

  watch(
    mainContract,
    (newContract) => {
      if (newContract) {
        getContractValue()
      }
    },
    { immediate: true },
  )

  onUnmounted(stopPolling)

  return {
    contract_address: computed(() => mainContract.value?.address.toString()),
    counter_value: computed(() => contractData.value?.counter_value),
    recent_sender: computed(() => contractData.value?.recent_sender),
    owner_address: computed(() => contractData.value?.owner_address),
    contract_balance: computed(() => balance.value),
    sendIncrement: async () => {
      return mainContract.value?.sendIncrement(sender, toNano('0.06'), 5)
    },
    sendDeposit: async () => {
      return mainContract.value?.sendDeploy(sender, toNano('0.03'))
    },
    sendWithdrawalRequest: async () => {
      return mainContract.value?.sendWithdrawalRequest(sender, toNano('0.003'), toNano('0.04'))
    },
    stopPolling,
  }
}
