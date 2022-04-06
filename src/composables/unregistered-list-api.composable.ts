import { UnregisteredDevice } from 'src/types/unregistered-device.interface'
import { computed, inject, InjectionKey, Ref, ref } from 'vue'

function useUnregisteredListBackend(): UnregisteredListApi {
  const store = ref<UnregisteredDevice[]>([])
  const isLoading = ref(false)

  async function fetch() {
    // noop
  }

  const devices = computed(() => store.value)

  return {
    devices,
    fetch,
    // wrapping with computed to make this read-only
    isLoading: computed(() => isLoading.value),
  }
}

export interface UnregisteredListApi {
  devices: Ref<UnregisteredDevice[]>
  fetch(): Promise<void>
  isLoading: Ref<boolean>
}

export const UNREGISTERED_LIST_API: InjectionKey<UnregisteredListApi> = Symbol(
  'unregistered list api'
)

export function useUnregisteredListApi() {
  return inject(UNREGISTERED_LIST_API, useUnregisteredListBackend, true)
}
