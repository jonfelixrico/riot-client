import { inject, InjectionKey } from 'vue'

export interface RegisterDeviceApi {
  register(device: { deviceId: string; firmwareVersion: string }): Promise<void>
}

export const REGISTER_DEVICE_API: InjectionKey<RegisterDeviceApi> = Symbol(
  'register device api'
)

function useRegisterDeviceBackend(): RegisterDeviceApi {
  throw new Error('noop')
}

export function useRegisterDeviceApi(): RegisterDeviceApi {
  return inject(REGISTER_DEVICE_API, useRegisterDeviceBackend, true)
}
