// composables/useAsyncInitialize.ts
import { ref, watchEffect, type WatchEffectOptions } from 'vue'

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: WatchEffectOptions = {}) {
  const state = ref<T | undefined>()

  watchEffect(async () => {
    state.value = await func()
  }, deps)

  return state
}
