import { getHttpEndpoint } from '@orbs-network/ton-access'
import { TonClient } from '@ton/ton'
import { useAsyncInitialize } from './useAsyncInit'

export function useTonClient() {
  return useAsyncInitialize(async () => {
    return new TonClient({
      endpoint: await getHttpEndpoint({ network: 'testnet' }),
    })
  })
}
