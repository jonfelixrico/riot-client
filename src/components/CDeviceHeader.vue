<template>
  <div>
    <div class="row items-center q-gutter-x-sm">
      <div class="text-h6">
        <h5 v-if="device.alias" class="q-my-none" data-cy="alias">
          {{ device.alias }}
        </h5>
        <h5 v-else data-cy="no-alias">No Alias</h5>
      </div>

      <q-badge v-if="isOnline" data-cy="online-ind" color="green">
        ONLINE
      </q-badge>
      <q-badge v-else data-cy="offline-ind" color="grey">OFFLINE</q-badge>
    </div>

    <div class="row q-gutter-x-sm">
      <div class="text-caption text-grey-7" data-cy="device-id">
        {{ device.deviceId }}
      </div>

      <q-separator vertical />

      <div class="text-caption text-grey-7" data-cy="version">
        v{{ device.firmwareVersion }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { DateTime } from 'luxon'
import { Device } from 'src/types/device.interface'
import { defineComponent, PropType } from 'vue'

const DEFAULT_OFFLINE_THRESHOLD = 5000

export default defineComponent({
  props: {
    device: {
      required: true,
      type: Object as PropType<Omit<Device, 'modules'>>,
    },

    refDt: {
      type: DateTime,
      default: () => DateTime.now(),
    },

    /**
     * If `refDt` is greater than `lastHeartbeatDt` by this amount (in milliseconds),
     * the device will be considered as offline.
     */
    heartbeatLapseThreshold: {
      type: Number,
      default: DEFAULT_OFFLINE_THRESHOLD,
    },

    lastHeartbeatDt: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const isOnline = computed(() => {
      return (
        props.refDt.diff(props.lastHeartbeatDt).milliseconds <=
        props.heartbeatLapseThreshold
      )
    })

    return {
      isOnline,
    }
  },
})
</script>
