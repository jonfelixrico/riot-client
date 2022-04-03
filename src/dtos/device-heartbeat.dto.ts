import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'

export interface IDeviceHeartbeatDto<T extends DateTime | string = string> {
  deviceId: string
  lastHeartbeatDt: T
}

export class DeviceHeartbeatDto implements IDeviceHeartbeatDto<DateTime> {
  deviceId!: string

  @Type(() => Date)
  @Transform(({ value }) => value && DateTime.fromJSDate(value))
  lastHeartbeatDt!: DateTime
}
