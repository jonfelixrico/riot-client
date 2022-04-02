export interface DeviceData {
  deviceId: string
  modules: {
    moduleId: string
    type: string
  }[]
  firmwareVersion: string
}
