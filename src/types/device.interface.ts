export interface DeviceModule {
  moduleId: string
  type: string
  alias?: string
}

export interface Device {
  deviceId: string
  modules: DeviceModule[]
  firmwareVersion: string
  alias?: string
}

export interface DeviceIdentifier {
  deviceId: string
  firmwareVersion: string
}

export interface ModuleIdentifier extends DeviceIdentifier {
  moduleId: string
}
