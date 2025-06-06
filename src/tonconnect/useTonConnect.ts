import type { Sender, SenderArguments } from '@ton/core'
import { useTonConnectUI } from './useTonConnectUI'

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const { tonConnectUI } = useTonConnectUI()

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 min for approve
        })
      },
    },
    connected: tonConnectUI.connected,
  }
}
