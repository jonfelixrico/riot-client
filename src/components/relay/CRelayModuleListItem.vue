<template>
  <div>
    <CDeviceModuleHeader :deviceModule="deviceModule" />
    <q-separator />
    <!-- TODO do not hardcode the height value -->
    <q-skeleton v-if="!relayConfig" height="200px" />

    <CDailySchedulePreview
      v-else-if="relayConfig.schedule.type === 'DAILY'"
      :utcOffset="relayConfig.schedule.utcOffset"
      :dailySchedule="relayConfig.schedule.dailySchedule"
    />

    <CWeeklySchedulePreview
      v-else-if="relayConfig.schedule.type === 'WEEKLY'"
      :utcOffset="relayConfig.schedule.utcOffset"
      :weeklySchedule="relayConfig.schedule.weeklySchedule"
    />
  </div>
</template>

<script lang="ts">
import CDeviceModuleHeader from 'components/CDeviceModuleHeader.vue'
import { DeviceIdentifier, DeviceModule } from 'src/types/device.interface'
import { defineComponent, onBeforeMount, PropType } from 'vue'
import { useGetRelayConfigApi } from 'composables/get-relay-config-api.composable'
import CDailySchedulePreview from './CDailySchedulePreview.vue'
import CWeeklySchedulePreview from './CWeekySchedulePreview.vue'

export default defineComponent({
  components: {
    CDeviceModuleHeader,
    CDailySchedulePreview,
    CWeeklySchedulePreview,
  },

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

  setup(props) {
    const { relayConfig, fetch } = useGetRelayConfigApi({
      ...props.deviceModule,
      ...props.device,
    })

    onBeforeMount(fetch)

    return {
      relayConfig,
    }
  },
})
</script>
