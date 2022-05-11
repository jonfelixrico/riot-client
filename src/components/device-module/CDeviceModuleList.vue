<!--
  All this does is that it lists up the modules of a device and displays
  the component associated with each type.
-->

<template>
  <component
    :is="getComponent(dModule)"
    v-for="dModule of device.modules"
    :key="dModule.moduleId"
    data-cy="device-module"
    :data-module-id="dModule.moduleId"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device, DeviceModule } from 'types/device.interface'
import CDeviceModuleListItem from './CDeviceModuleListItem.vue'
import CRelayModuleListItem from 'components/relay/CRelayModuleListItem.vue'
import CUnknownModule from './CUnknownModule.vue'

/**
 * The key is supposed to be the device module types and the values are the actual
 * component definition to map to that type.
 */
const COMPONENT_MAPPING: Record<string, ReturnType<typeof defineComponent>> = {
  RELAY: CRelayModuleListItem,
}

export default defineComponent({
  components: { CDeviceModuleListItem },

  props: {
    device: {
      type: Object as PropType<Device>,
      required: true,
    },
  },

  methods: {
    getComponent({ type }: DeviceModule) {
      if (COMPONENT_MAPPING[type]) {
        return COMPONENT_MAPPING[type]
      }

      return CUnknownModule
    },
  },
})
</script>
