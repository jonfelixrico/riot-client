import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'

export class UnregisteredDeviceDto implements UnregisteredDevice {
  @Type(() => Date)
  @Transform(({ value }) => value && DateTime.fromJSDate(value))
  lastQueueDt!: DateTime

  deviceId!: string
  modules!: { moduleId: string; type: string }[]
  firmwareVersion!: string
}
