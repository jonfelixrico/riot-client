<template>
  <q-item
    v-for="deviceModule of deviceModules"
    :key="deviceModule.moduleId"
    data-cy="device-module"
    :data-module-id="deviceModule.moduleId"
    clickable
  >
    <q-item-section>
      <CDeviceModuleHeader :deviceModule="deviceModule" headingLevel="6" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import CDeviceModuleHeader from './CDeviceModuleHeader.vue'

export default defineComponent({
  components: {
    CDeviceModuleHeader,
  },

  props: {
    deviceModules: {
      type: Array as PropType<Device['modules']>,
    },
  },
})
</script>
