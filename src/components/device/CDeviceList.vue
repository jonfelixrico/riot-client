<template>
  <q-list separator>
    <CDeviceListItem
      v-for="device of devices"
      :key="device.deviceId"
      :ref-dt="refDt"
      :heartbeat-lapse-threshold="heartbeatLapseThreshold"
      :device="device"
      :last-heartbeat-dt="lastHeartbeats[device.deviceId] ?? EPOCH"
      clickable
      data-cy="list-item"
      :data-device-id="device.deviceId"
      @click="$emit('click', device)"
    />
  </q-list>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { Device } from 'types/device.interface'
import { defineComponent, PropType } from 'vue'
import CDeviceListItem from './CDeviceListItem.vue'
import { EPOCH } from 'utils/date.utils'

export default defineComponent({
  components: {
    CDeviceListItem,
  },

  props: {
    refDt: DateTime,
    heartbeatLapseThreshold: Number,

    devices: {
      type: Array as PropType<Array<Device>>,
      default: () => [],
    },

    lastHeartbeats: {
      type: Object as PropType<Record<string, DateTime>>,
      default: () => ({}),
    },
  },

  emits: ['click'],

  setup() {
    return {
      EPOCH,
    }
  },
})
</script>
