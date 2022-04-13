<template>
  <q-item
    v-for="dModule of device.modules"
    :key="dModule.moduleId"
    data-cy="device-module"
    :data-module-id="dModule.moduleId"
    clickable
  >
    <q-item-section>
      <CDeviceModuleHeader
        v-if="!COMPONENT_MAP[dModule.type]"
        :deviceModule="dModule"
      />
      <component
        v-else
        :is="COMPONENT_MAP[dModule.type]"
        :deviceModule="dModule"
        :device="{
          deviceId: device.deviceId,
          firmwareVersion: device.firmwareVersion,
        }"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Device } from 'types/device.interface'
import CDeviceModuleHeader from './CDeviceModuleHeader.vue'
import CRelayModuleListItem from 'components/relay/CRelayModuleListItem.vue'

// TODO try to make this load lazily; right now this is eagerly loaded
const COMPONENT_MAP = {
  RELAY: CRelayModuleListItem,
}

export default defineComponent({
  components: {
    CDeviceModuleHeader,
  },

  props: {
    device: {
      type: Object as PropType<Device>,
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
