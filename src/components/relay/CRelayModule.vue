<!-- This represents a relay module. This is meant to be used with module listing. -->

<template>
  <q-item>
    <q-item-section>
      <CDeviceModuleHeader :device-module="deviceModule" />
      <q-separator />
      <!-- TODO do not hardcode the height value -->
      <q-skeleton v-if="!relayConfig" height="200px" />

      <CDailySchedulePreview
        v-else-if="relayConfig.schedule.type === 'DAILY'"
        :utc-offset="relayConfig.schedule.utcOffset"
        :daily-schedule="relayConfig.schedule.dailySchedule"
        :now="now"
      />

      <CWeeklySchedulePreview
        v-else-if="relayConfig.schedule.type === 'WEEKLY'"
        :utc-offset="relayConfig.schedule.utcOffset"
        :weekly-schedule="relayConfig.schedule.weeklySchedule"
        :now="now"
      />
    </q-item-section>

    <q-item-section side>
      <q-btn unelevated no-caps color="primary" @click="onEditClick">
        {{ t('common.edit') }}
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import CDeviceModuleHeader from 'components/device-module/CDeviceModuleHeader.vue'
import { DeviceIdentifier, DeviceModule } from 'src/types/device.interface'
import { defineComponent, onBeforeMount, PropType } from 'vue'
import { useGetRelayConfigApi } from 'composables/get-relay-config-api.composable'
import CDailySchedulePreview from './CDailySchedulePreview.vue'
import CWeeklySchedulePreview from './CWeeklySchedulePreview.vue'
import { computed } from '@vue/reactivity'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import CSetScheduleDialog from 'components/relay-details/set-schedule-dialog/CSetScheduleDialog.vue'

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
    const { response, fetch } = useGetRelayConfigApi({
      ...props.deviceModule,
      ...props.device,
    })

    const relayConfig = computed(() => {
      if (!response.value || response.value.type === 'error') {
        return null
      }

      return response.value.data
    })

    onBeforeMount(fetch)

    const { now } = useTickingDateTime()

    const { t } = useI18n()

    const $q = useQuasar()

    function onEditClick() {
      $q.dialog({
        component: CSetScheduleDialog,
      })
    }

    return {
      relayConfig,
      now,
      t,
      onEditClick,
    }
  },
})
</script>
