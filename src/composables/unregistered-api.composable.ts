import { UnregisteredDevice } from 'src/types/unregistered-device.interface'
import { computed, inject, InjectionKey, Ref, ref } from 'vue'

function useUnregisteredListBackend(): UnregisteredListApi {
  const state = ref<UnregisteredDevice[]>([])

  async function fetch() {
    // noop
  }

  const devices = computed(() => state.value)

  return {
    devices,
    fetch,
  }
}

export interface UnregisteredListApi {
  devices: Ref<UnregisteredDevice[]>
  fetch(): Promise<void>
}

export const UNREGISTERED_LIST_API: InjectionKey<UnregisteredListApi> = Symbol(
  'unregistered list api'
)

export function useUnregisteredListApi() {
  return inject(UNREGISTERED_LIST_API, useUnregisteredListBackend, true)
}
