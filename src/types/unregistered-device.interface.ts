import { DateTime } from 'luxon'
import { Device, DeviceModule } from './device.interface'

export interface UnregisteredDevice extends Omit<Device, 'alias'> {
  lastQueueDt: DateTime
  modules: Omit<DeviceModule, 'alias'>[]
}
