<template>
  <q-page>
    <CDeviceList :refDt="now" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CDeviceList from 'components/CDeviceList.vue'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'
import { Device } from 'src/types/device.interface'
import { DateTime } from 'luxon'
import { useApi } from 'composables/axios.composable'
import { DeviceHeartbeatDto, IDeviceHeartbeatDto } from 'src/dtos/device.dto'
import { plainToInstance } from 'class-transformer'

function useDeviceRepo() {
  const devices = ref<Device[]>([])
  const axios = useApi()

  async function fetchDevices() {
    const { data } = await axios.get<Device[]>('device')
    devices.value = data
    return data
  }

  return {
    devices,
    fetchDevices,
  }
}

function useDeviceHeartbeatRepo() {
  const heartbeats = ref<Record<string, DateTime>>({})
  const axios = useApi()

  async function fetchHeartbeats() {
    const { data } = await axios.get<IDeviceHeartbeatDto<string>[]>(
      'device/heartbeat'
    )
    const transformed = plainToInstance(DeviceHeartbeatDto, data)

    heartbeats.value = transformed.reduce<Record<string, DateTime>>(
      (acc, { deviceId, lastHeartbeatDt }) => {
        acc[deviceId] = lastHeartbeatDt
        return acc
      },
      {}
    )

    return heartbeats.value
  }

  return {
    heartbeats,
    fetchHeartbeats,
  }
}

export default defineComponent({
  components: {
    CDeviceList,
  },

  setup() {
    const { devices, fetchDevices } = useDeviceRepo()
    const { heartbeats, fetchHeartbeats } = useDeviceHeartbeatRepo()

    void fetchDevices()
    void fetchHeartbeats()

    return {
      ...useTickingDateTime(),
      devices,
      heartbeats,
    }
  },
})
</script>
