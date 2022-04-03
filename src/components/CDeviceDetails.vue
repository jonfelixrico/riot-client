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

    <q-card-section>
      <q-list separator>
        <q-item
          v-for="deviceModule of device.modules"
          :key="deviceModule.moduleId"
          data-cy="device-module"
          :data-module-id="deviceModule.moduleId"
        >
          <q-item-section>
            <CDeviceModuleHeader
              :deviceModule="deviceModule"
              headingLevel="6"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import { DateTime } from 'luxon'
import CDeviceHeader from './CDeviceHeader.vue'
import CDeviceModuleHeader from './CDeviceModuleHeader.vue'

export default defineComponent({
  components: {
    CDeviceHeader,
    CDeviceModuleHeader,
  },

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

    lastHeartbeatDt: DateTime,
  },
})
</script>
