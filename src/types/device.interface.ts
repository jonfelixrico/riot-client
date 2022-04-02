export interface Device {
  deviceId: string
  modules: {
    moduleId: string
    type: string
  }[]
  firmwareVersion: string
}
