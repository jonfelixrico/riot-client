<template>
  <q-item>
    <q-item-section avatar>
      <q-icon v-if="isOnline" name="circle" data-cy="online-ind" />
      <q-icon v-else name="radio_button_unchecked" data-cy="offline-ind" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { computed, defineComponent } from 'vue'

const DEFAULT_OFFLINE_THRESHOLD = 5000

export default defineComponent({
  props: {
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
