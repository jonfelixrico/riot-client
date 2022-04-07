import { defineStore } from 'pinia'
import { DeviceIdentifier } from 'src/types/device.interface'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'

interface UnregisteredDevicesState {
  devices: UnregisteredDevice[]
}

export const useUnregisteredDevicesStore = defineStore('unregisteredDevices', {
  state: (): UnregisteredDevicesState => ({
    devices: [],
  }),

  actions: {
    setDevices(devices: UnregisteredDevice[]) {
      this.devices = devices
    },

    removeDevice({ deviceId, firmwareVersion }: DeviceIdentifier): void {
      const { devices } = this

      const index = devices.findIndex(
        (d) => d.deviceId === deviceId && d.firmwareVersion === firmwareVersion
      )

      devices.splice(index, 1)
    },
  },
})
