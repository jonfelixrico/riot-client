<template>
  <q-page class="row justify-center bg-grey-3">
    <div class="content column q-pa-md q-gutter-y-sm">
      <div class="row items-center q-gutter-x-sm">
        <q-btn icon="arrow_back" flat dense round @click="onBackClick" />
      </div>
      <q-card class="col" flat>
        <q-card-content>
          <!-- TODO add content here -->
        </q-card-content>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { plainToInstance } from 'class-transformer'
import { DateTime } from 'luxon'
import { useApi } from 'src/composables/axios.composable'
import { DeviceDto, IDeviceDto } from 'src/dtos/device.dto'
import { Device } from 'src/types/device.interface'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface DeviceQuery {
  deviceId: string
  firmwareVersion: string
}

function useDeviceFetcher({ deviceId, firmwareVersion }: DeviceQuery) {
  const api = useApi()

  const lastFetchDt = ref<DateTime | null>(null)
  const device = ref<Device | null>(null)
  const lastHeartbeatDt = ref<DateTime | null>(null)
  const isLoading = ref(false)

  async function fetch() {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    try {
      const { data } = await api.get<IDeviceDto>(
        `device/${deviceId}/version/${firmwareVersion}`
      )

      const dto = plainToInstance(DeviceDto, data)
      lastFetchDt.value = DateTime.now()
      device.value = dto
      if (
        !lastHeartbeatDt.value ||
        !lastHeartbeatDt.value?.equals(dto.lastHeartbeatDt)
      ) {
        lastHeartbeatDt.value = dto.lastHeartbeatDt
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    lastFetchDt,
    device,
    fetch,
    isLoading,
  }
}

export default defineComponent({
  setup() {
    const router = useRouter()
    function onBackClick() {
      router.push({ name: 'device-list' })
    }

    const route = useRoute()
    const { device, fetch, isLoading, lastFetchDt } = useDeviceFetcher({
      deviceId: route.params.deviceId as string,
      firmwareVersion: route.params.version as string,
    })

    onBeforeMount(() => {
      void fetch()
    })

    return {
      onBackClick,
      device,
      isLoading,
      lastFetchDt,
      fetch,
    }
  },
})
</script>

<style lang="scss" scoped>
.content {
  body.screen--lg,
  body.screen--md,
  body.screen--xl & {
    width: 1024px;
  }
}
</style>
