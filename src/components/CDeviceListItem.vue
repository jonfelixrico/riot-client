<template>
  <q-item>
    <q-item-section>
      <div class="column q-gutter-y-sm">
        <div class="row items-center">
          <div class="row q-gutter-x-sm items-center">
            <div data-cy="version" class="text-caption text-grey-7">
              {{ device.firmwareVersion }}
            </div>
            <h6 class="text-h6 q-my-none">
              Device <span v-text="device.deviceId" data-cy="device-id" />
            </h6>
          </div>
          <q-space />
          <q-chip
            v-if="isOnline"
            dense
            color="green"
            text-color="white"
            data-cy="online-ind"
            :clickable="false"
          >
            ONLINE
          </q-chip>
          <q-chip
            v-else
            dense
            color="grey-7"
            text-color="white"
            data-cy="offline-ind"
            :clickable="false"
          >
            OFFLINE
          </q-chip>
        </div>
        <div class="row">
          <q-chip
            v-for="{ type, count } of moduleGroups"
            :key="type"
            :data-cy="`module-chip-${type}`"
            dense
            :clickable="false"
          >
            <q-avatar
              data-cy="count"
              color="grey-8"
              text-color="white"
              class="text-weight-bold"
            >
              {{ count }}
            </q-avatar>
            <div class="q-pa-xs">{{ type }}</div>
          </q-chip>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { computed, defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import { sortBy } from 'lodash'

interface ModuleGroup {
  type: string
  count: number
}

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

    device: {
      type: Object as PropType<Device>,
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

    const moduleGroups = computed(() => {
      const groups: Record<string, ModuleGroup> = {}
      for (const { type } of props.device.modules) {
        if (groups[type]) {
          groups[type].count++
          continue
        }

        groups[type] = {
          type,
          count: 1,
        }
      }

      return sortBy(groups, 'count')
    })

    return {
      isOnline,
      moduleGroups,
    }
  },
})
</script>
