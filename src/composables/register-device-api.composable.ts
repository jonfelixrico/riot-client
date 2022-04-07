import { useUnregisteredDevicesStore } from 'src/stores/unregistered-devices-store'
import { inject, InjectionKey } from 'vue'
import { useApi } from './axios.composable'

export interface RegisterDeviceApi {
  register(device: { deviceId: string; firmwareVersion: string }): Promise<void>
}

export const REGISTER_DEVICE_API: InjectionKey<RegisterDeviceApi> = Symbol(
  'register device api'
)

function useRegisterDeviceBackend(): RegisterDeviceApi {
  const api = useApi()
  const unregDeviceStore = useUnregisteredDevicesStore()

  const register: RegisterDeviceApi['register'] = async ({
    deviceId,
    firmwareVersion,
  }) => {
    await api.post(`device/${deviceId}/version/${firmwareVersion}`, {
      deviceId,
      firmwareVersion,
    })

    unregDeviceStore.removeDevice({
      deviceId,
      firmwareVersion,
    })
  }

  return {
    register,
  }
}

export function useRegisterDeviceApi(): RegisterDeviceApi {
  return inject(REGISTER_DEVICE_API, useRegisterDeviceBackend, true)
}
