<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6" role="heading" aria-level="1">
          {{ t('relay.dialogs.setSchedule.title') }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row">
          <q-radio
            v-model="mode"
            class="col"
            val="CYCLE"
            :label="t('relay.setScheduleType.cycle')"
          />

          <q-radio
            v-model="mode"
            class="col"
            val="SINGLE_ON"
            :label="t('relay.setScheduleType.singleOn')"
          />
        </div>

        <CHorizontalSchedulePreview :entries="schedToDisplay" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <CSingleOnInput
          v-if="mode === 'SINGLE_ON'"
          v-model:start="singleOn.start"
          v-model:end="singleOn.end"
        />

        <CCycleInput
          v-else
          v-model:on="cycle.on"
          v-model:off="cycle.off"
          v-model:firstState="cycle.firstState"
        />
      </q-card-section>

      <q-separator />

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
import { useI18n } from 'vue-i18n'
import CSingleOnInput from './CSingleOnInput.vue'
import { useSetScheduleModel } from './set-schedule-model.composable'
import CCycleInput from './CCycleInput.vue'
import { PresentationScheduleEntry } from 'components/relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from 'components/relay/relay.constants'
import { computed } from '@vue/reactivity'
import CHorizontalSchedulePreview from 'components/relay/CHorizontalSchedulePreview.vue'

const NULL_SCHEDULE: PresentationScheduleEntry[] = [
  {
    start: 0,
    end: MAX_SECONDS,
    state: 'OFF',
  },
]

export default {
  components: {
    CSingleOnInput,
    CCycleInput,
    CHorizontalSchedulePreview,
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { t } = useI18n()

    const { schedule, mode, cycle, singleOn } = useSetScheduleModel()

    // TODO maybe its better to use a QForm?
    function onOk() {
      if (!schedule.value) {
        console.warn('Attempted to send blank schedule.')
        return
      }

      onDialogOK(schedule.value)
    }

    const schedToDisplay = computed(() => schedule.value ?? NULL_SCHEDULE)

    return {
      dialogRef,
      onDialogHide,
      onOk,
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
