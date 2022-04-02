import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { Device } from 'src/types/device.interface'

export interface IDeviceDto<T extends string | DateTime = DateTime>
  extends Device {
  lastHeartbeatDt: T
}

export class DeviceDto implements IDeviceDto<DateTime> {
  @Type(() => Date)
  @Transform(({ value }) => value && DateTime.fromJSDate(value))
  lastHeartbeatDt!: DateTime

  deviceId!: string
  modules!: { moduleId: string; type: string }[]
  firmwareVersion!: string
  alias?: string | undefined
}
