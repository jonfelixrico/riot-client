<template>
  <q-page>
    <div class="column q-pa-md q-gutter-y-sm page-width q-mx-auto">
      <div class="row items-center q-gutter-x-sm">
        <q-btn icon="arrow_back" flat dense round @click="onBackClick" />
        <q-space />
        <div class="row q-gutter-x-sm items-center">
          <span>{{ formattedLastFetchDt }}</span>
          <q-btn
            icon="refresh"
            :loading="isLoading"
            flat
            dense
            round
            @click="fetch"
          />
        </div>
      </div>

      <q-card flat>
        <q-card-section>
          <CDeviceHeader
            v-if="device"
            :device="device"
            :lastHeartbeatDt="lastHeartbeatDt ?? undefined"
          />
        </q-card-section>
      </q-card>

      <q-card flat>
        <q-card-section>
          <CDeviceModuleList v-if="device" :deviceModules="device.modules" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { plainToInstance } from 'class-transformer'
import { DateTime } from 'luxon'
import { useApi } from 'src/composables/axios.composable'
import { DeviceDto, IDeviceDto } from 'src/dtos/device.dto'
import { Device } from 'src/types/device.interface'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRelativeFormattingToken } from 'utils/date.utils'
import CDeviceHeader from 'components/CDeviceHeader.vue'
import CDeviceModuleList from 'components/CDeviceModuleList.vue'

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
    lastHeartbeatDt,
  }
}

export default defineComponent({
  components: {
    CDeviceModuleList,
    CDeviceHeader,
  },

  setup() {
    const router = useRouter()
    function onBackClick() {
      router.push({ name: 'device-list' })
    }

    const route = useRoute()
    const { device, fetch, isLoading, lastFetchDt, lastHeartbeatDt } =
      useDeviceFetcher({
        deviceId: route.params.deviceId as string,
        firmwareVersion: route.params.version as string,
      })

    onBeforeMount(() => {
      void fetch()
    })

    const formattedLastFetchDt = computed(() => {
      if (!lastFetchDt.value) {
        return null
      }

      return lastFetchDt.value.toLocaleString(
        getRelativeFormattingToken(lastFetchDt.value)
      )
    })

    return {
      onBackClick,
      device,
      isLoading,
      lastFetchDt,
      fetch,
      formattedLastFetchDt,
      lastHeartbeatDt,
    }
  },
})
</script>
