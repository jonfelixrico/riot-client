import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { Device, DeviceModule } from 'src/types/device.interface'

export interface IDeviceDto<T extends string | DateTime = string>
  extends Device {
  lastHeartbeatDt: T
}

export class DeviceDto implements IDeviceDto<DateTime> {
  @Type(() => Date)
  @Transform(({ value }) => value && DateTime.fromJSDate(value))
  lastHeartbeatDt!: DateTime

  deviceId!: string
  modules!: DeviceModule[]
  firmwareVersion!: string
  alias?: string | undefined
}
