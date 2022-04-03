<template>
  <q-card>
    <q-card-section>
      <CDeviceHeader
        :device="device"
        :refDt="refDt"
        :heartbeatLapseThreshold="heartbeatLapseThreshold"
        :lastHeartbeatDt="lastHeartbeatDt"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import { DateTime } from 'luxon'

export default defineComponent({
  props: {
    device: {
      required: true,
      type: Object as PropType<Device>,
    },

    refDt: DateTime,

    /**
     * If `refDt` is greater than `lastHeartbeatDt` by this amount (in milliseconds),
     * the device will be considered as offline.
     */
    heartbeatLapseThreshold: Number,

    lastHeartbeatDt: {
      type: DateTime,
      required: true,
    },
  },
})
</script>
