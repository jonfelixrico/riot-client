<!--
  This simply lists down the modules of a device.
  This acts as the dispatcher as to what component to render depending on the
  type of a module.
-->

<template>
  <component
    :is="getComponent(dModule)"
    v-for="dModule of device.modules"
    :key="dModule.moduleId"
    data-cy="device-module"
    :data-module-id="dModule.moduleId"
    :device-module="dModule"
    :device="device"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device, DeviceModule } from 'types/device.interface'
import CRelayModule from 'components/relay/CRelayModule.vue'
import CUnknownModule from './CUnknownModule.vue'

/**
 * The key is supposed to be the device module types and the values are the actual
 * component definition to map to that type.
 */
const COMPONENT_MAPPING: Record<string, ReturnType<typeof defineComponent>> = {
  RELAY: CRelayModule,
}

export default defineComponent({
  props: {
    device: {
      type: Object as PropType<Device>,
      required: true,
    },
  },

  methods: {
    /**
     * Determines which component to display based on the given device module.
     */
    getComponent({ type }: DeviceModule) {
      if (COMPONENT_MAPPING[type]) {
        return COMPONENT_MAPPING[type]
      }

      return CUnknownModule
    },
  },
})
</script>
