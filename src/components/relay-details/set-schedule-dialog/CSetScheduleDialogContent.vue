<template>
  <q-card>
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
        @click="submit"
      />
      <q-btn no-caps flat dense :label="t('common.cancel')" @click="cancel" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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

export default defineComponent({
  components: {
    CSingleOnInput,
    CCycleInput,
    CHorizontalSchedulePreview,
  },

  emits: ['submit', 'cancel'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const { schedule, mode, cycle, singleOn } = useSetScheduleModel()

    // TODO maybe its better to use a QForm?
    function submit() {
      if (!schedule.value) {
        console.warn('Attempted to send blank schedule.')
        return
      }

      emit('submit', schedule.value)
    }

    function cancel() {
      emit('cancel')
    }

    const schedToDisplay = computed(() => schedule.value ?? NULL_SCHEDULE)

    return {
      t,
      cycle,
      singleOn,
      mode,
      schedToDisplay,
      submit,
      cancel,
    }
  },
})
</script>
