<template>
  <!-- For unknown types -->
  <CDeviceModuleHeader
    v-if="!COMPONENT_MAP[deviceModule.type]"
    :device-module="deviceModule"
  />

  <component
    :is="COMPONENT_MAP[deviceModule.type]"
    v-else
    :device-module="deviceModule"
    :device="device"
  />
</template>

<script lang="ts">
import { DeviceIdentifier, DeviceModule } from 'src/types/device.interface'
import { defineComponent, PropType } from 'vue'
import CRelayModuleListItem from '../relay/CRelayModuleListItem.vue'

// TODO try to make this load lazily; right now this is eagerly loaded
const COMPONENT_MAP = {
  RELAY: CRelayModuleListItem,
}

/**
 * The puropse of this component is to dispatch between sub-components based
 * on the type.
 */
export default defineComponent({
  props: {
    deviceModule: {
      type: Object as PropType<DeviceModule>,
      required: true,
    },

    device: {
      type: Object as PropType<DeviceIdentifier>,
      required: true,
    },
  },

  setup() {
    return {
      COMPONENT_MAP,
    }
  },
})
</script>
