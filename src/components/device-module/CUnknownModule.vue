<!--
  This component is the one we're supposed to show in the list if ever we receive a module
  type from the backend which is not yet implemented/supported by the front end.
-->

<template>
  <!-- Unknown modules are not supposed to be interacted with, hence its not clickable. -->
  <q-item>
    <q-item-section>
      <CDeviceModuleHeader :device-module="deviceModule" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { DeviceModule } from 'src/types/device.interface'
import { defineComponent, PropType } from 'vue'
import CDeviceModuleHeader from './CDeviceModuleHeader.vue'

export default defineComponent({
  components: {
    CDeviceModuleHeader,
  },

  props: {
    deviceModule: {
      type: Object as PropType<DeviceModule>,
      required: true,
    },
  },
})
</script>
