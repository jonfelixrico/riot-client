<template>
  <q-page>
    <div class="page-width q-mx-auto q-pa-sm">
      <q-card flat>
        <q-card-section>
          <CDeviceList
            :ref-dt="now"
            :devices="devices"
            :last-heartbeats="heartbeats"
            @click="onDeviceClick"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import CDeviceList from 'components/device/CDeviceList.vue'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'
import { DateTime } from 'luxon'
import { useApi } from 'composables/axios.composable'
import {
  DeviceHeartbeatDto,
  IDeviceHeartbeatDto,
} from 'dtos/device-heartbeat.dto'
import { plainToInstance } from 'class-transformer'
import { IDeviceDto, DeviceDto } from 'dtos/device.dto'
import { useRouter } from 'vue-router'

function useDeviceRepo() {
  const devices = ref<DeviceDto[]>([])
  const heartbeats = ref<Record<string, DateTime>>({})
  const axios = useApi()

  function updateHeartbeats(arr: IDeviceHeartbeatDto<DateTime>[]) {
    for (const { deviceId, lastHeartbeatDt } of arr) {
      heartbeats.value[deviceId] = lastHeartbeatDt
    }
  }

  async function fetchDevices(): Promise<void> {
    const { data } = await axios.get<IDeviceDto[]>('device')
    devices.value = plainToInstance(DeviceDto, data)

    updateHeartbeats(devices.value)
  }

  async function fetchHeartbeats(): Promise<void> {
    const { data } = await axios.get<IDeviceHeartbeatDto<string>[]>(
      'device/heartbeat'
    )
    const transformed = plainToInstance(DeviceHeartbeatDto, data)
    updateHeartbeats(transformed)
  }

  return {
    devices,
    fetchDevices,
    fetchHeartbeats,
    heartbeats,
  }
}

const HEARTBEAT_FETCH_INTERVAL = 5000

export default defineComponent({
  components: {
    CDeviceList,
  },

  setup() {
    const { devices, fetchDevices, heartbeats, fetchHeartbeats } =
      useDeviceRepo()

    void fetchDevices()

    const intervalId = setInterval(() => {
      void fetchHeartbeats()
    }, HEARTBEAT_FETCH_INTERVAL)

    onBeforeUnmount(() => {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
      }
    })

    const router = useRouter()
    function onDeviceClick({
      deviceId,
      firmwareVersion,
    }: {
      deviceId: string
      firmwareVersion: string
    }) {
      void router.push({
        name: 'device-details',
        params: { deviceId, version: firmwareVersion },
      })
    }

    return {
      ...useTickingDateTime(),
      devices,
      heartbeats,
      onDeviceClick,
    }
  },
})
</script>
