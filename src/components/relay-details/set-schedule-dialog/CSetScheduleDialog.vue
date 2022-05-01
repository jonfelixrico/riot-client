<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <CSetScheduleDialogContent
      class="q-dialog-plugin"
      @submit="onDialogOK"
      @cancel="onDialogCancel"
    />
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSetScheduleModel } from './set-schedule-model.composable'
import { PresentationScheduleEntry } from 'components/relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from 'components/relay/relay.constants'
import { computed } from '@vue/reactivity'
import CSetScheduleDialogContent from './CSetScheduleDialogContent.vue'

const NULL_SCHEDULE: PresentationScheduleEntry[] = [
  {
    start: 0,
    end: MAX_SECONDS,
    state: 'OFF',
  },
]

export default {
  components: {
    CSetScheduleDialogContent,
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { t } = useI18n()

    const { schedule, mode, cycle, singleOn } = useSetScheduleModel()

    const schedToDisplay = computed(() => schedule.value ?? NULL_SCHEDULE)

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      t,
      cycle,
      singleOn,
      mode,
      schedToDisplay,
    }
  },
}
</script>
