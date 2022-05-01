<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6" role="heading" aria-level="1">
          {{ t('relay.dialogs.setSchedule.title') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-radio
          v-model="mode"
          val="SINGLE_ON"
          :label="t('relay.setScheduleType.singleOn')"
        />

        <q-radio
          v-model="mode"
          val="CYCLE"
          :label="t('relay.setScheduleType.cycle')"
        />
      </q-card-section>

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
import { useSetScheduleModel } from './composables/set-schedule-model.composable'
import CCycleInput from './CCycleInput.vue'

export default {
  components: {
    CSingleOnInput,
    CCycleInput,
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

    return {
      dialogRef,
      onDialogHide,
      onOk,
      onDialogCancel,
      t,
      cycle,
      singleOn,
      mode,
    }
  },
}
</script>
