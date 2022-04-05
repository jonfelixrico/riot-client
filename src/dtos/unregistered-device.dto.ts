import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { Device } from 'src/types/device.interface'

export interface IUnregisteredDeviceDto<T extends string | DateTime = string>
  extends Device {
  lastQueueDt: T
}

export class UnregisteredDeviceDto implements IUnregisteredDeviceDto<DateTime> {
  @Type(() => Date)
  @Transform(({ value }) => value && DateTime.fromJSDate(value))
  lastQueueDt!: DateTime

  deviceId!: string
  modules!: { moduleId: string; type: string }[]
  firmwareVersion!: string
}
