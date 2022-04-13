<template>
  <q-item
    v-for="dModule of device.modules"
    :key="dModule.moduleId"
    data-cy="device-module"
    :data-module-id="dModule.moduleId"
    clickable
  >
    <q-item-section>
      <CDeviceModuleListItem :device="device" :device-module="dModule" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import CDeviceModuleListItem from './CDeviceModuleListItem.vue'

export default defineComponent({
  props: {
    device: {
      type: Object as PropType<Device>,
      required: true,
    },
  },
  components: { CDeviceModuleListItem },
})
</script>
