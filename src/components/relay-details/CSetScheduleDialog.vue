<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6" role="heading" aria-level="1">
          {{ t('relay.dialogs.setSchedule.title') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <CTimeInput v-model="start" />
        <CTimeInput v-model="end" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          no-caps
          unelevated
          dense
          :label="t('relay.dialogs.setSchedule.ok')"
          @click="onOk"
        />
        <q-btn
          no-caps
          flat
          dense
          :label="t('common.cancel')"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from '../relay/relay.constants'
import CTimeInput from './CTimeInput.vue'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { t } = useI18n()

    const start = ref<string>('')
    const end = ref<string>('')

    function convertToScheduleArray(startString: string, endString: string) {
      if (!startString || !endString) {
        return
      }

      const startSeconds = timeStringToSeconds(startString)
      const endSeconds = timeStringToSeconds(endString)

      const schedules: PresentationScheduleEntry[] = []

      if (startSeconds !== 0) {
        schedules.push({
          start: 0,
          end: startSeconds - 1,
          state: 'OFF',
        })
      }

      schedules.push({
        start: startSeconds,
        end: endSeconds,
        state: 'ON',
      })

      if (endSeconds !== MAX_SECONDS) {
        schedules.push({
          start: endSeconds + 1,
          end: MAX_SECONDS,
          state: 'OFF',
        })
      }

      return schedules
    }

    // TODO maybe its better to use a QForm?
    function onOk() {
      const value = convertToScheduleArray(start.value, end.value)
      if (!value) {
        return
      }

      onDialogOK(value)
    }

    return {
      dialogRef,
      onDialogHide,
      onOk,
      onDialogCancel,
      t,

      start,
      end,
    }
  },

  computed: {
    CTimeInput,
  },
}
</script>
