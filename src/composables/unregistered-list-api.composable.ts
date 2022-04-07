import { plainToInstance } from 'class-transformer'
import { UnregisteredDeviceDto } from 'src/dtos/unregistered-device.dto'
import { useUnregisteredDevicesStore } from 'src/stores/unregistered-devices-store'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'
import { computed, inject, InjectionKey, Ref, ref } from 'vue'
import { useApi } from './axios.composable'

interface UnregisteredDevicePlain
  extends Omit<UnregisteredDevice, 'lastQueueDt'> {
  lastQueueDt: string
}

function useUnregisteredListBackend(): UnregisteredListApi {
  const unregDevicesStore = useUnregisteredDevicesStore()
  const isLoading = ref(false)

  const api = useApi()

  async function fetch() {
    isLoading.value = true
    try {
      const response = await api.get<UnregisteredDevicePlain[]>(
        'device/unregistered'
      )

      unregDevicesStore.setDevices(
        plainToInstance(UnregisteredDeviceDto, response.data)
      )
    } finally {
      isLoading.value = false
    }
  }

  return {
    devices: computed(() => unregDevicesStore.devices), // wrapping with computed for compatibility with the interface
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
