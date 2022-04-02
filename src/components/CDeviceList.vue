<template>
  <q-list>
    <CDeviceListItem
      v-for="device of devices"
      :refDt="refDt"
      :heartbeatLapseThreshold="heartbeatLapseThreshold"
      :device="device"
      :key="device.deviceId"
      :lastHeartbeatDt="lastHeartbeats[device.deviceId] ?? EPOCH"
      clickable
      @click="$emit('click', device)"
      data-cy="list-item"
      :data-device-id="device.deviceId"
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

  setup() {
    return {
      EPOCH,
    }
  },

  emits: ['click'],
})
</script>
