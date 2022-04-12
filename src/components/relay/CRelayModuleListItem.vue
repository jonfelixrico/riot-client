<template>
  <div>
    <CDeviceModuleHeader :deviceModule="deviceModule" />
    <q-separator />
    <div></div>
  </div>
</template>

<script lang="ts">
import CDeviceModuleHeader from 'components/CDeviceModuleHeader.vue'
import { DeviceModule } from 'src/types/device.interface'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { CDeviceModuleHeader },

  props: {
    deviceModule: {
      type: Object as PropType<DeviceModule>,
      required: true,
    },
  },
})
</script>
