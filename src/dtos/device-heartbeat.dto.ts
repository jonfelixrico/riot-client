import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'

export interface IDeviceHeartbeatDto<T extends DateTime | string = DateTime> {
  deviceId: string
  lastHeartbeatDt: T
}

export class DeviceHeartbeatDto implements IDeviceHeartbeatDto {
  deviceId!: string

  @Type(() => Date)
  @Transform(({ value }) => DateTime.fromJSDate(value))
  lastHeartbeatDt!: DateTime
}
