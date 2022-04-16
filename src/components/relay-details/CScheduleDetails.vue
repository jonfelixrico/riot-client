<template>
  <q-expansion-item>
    <template #header>
      <div class="fit row items-center">
        <div
          :style="{ height: `${SCHEDULE_BAR_HEIGHT}px` }"
          class="relative-position col"
        >
          <q-resize-observer @resize="onResize" />
          <div class="absolute">
            <CScheduleDisplay
              :items="modelValue"
              :height="SCHEDULE_BAR_HEIGHT"
              :width="width"
            />
          </div>
        </div>
      </div>
    </template>

    <template #default>
      <div class="q-pa-sm">
        <div class="row q-col-gutter-x-sm">
          <div class="col q-gutter-y-sm">
            <div
              v-for="{ entry, i18nParts } in forPresentation"
              :key="`${entry.start}-${entry.end}`"
            >
              <i18n-t keypath="relay.timeSlotLabel.format">
                <template #start>
                  <span class="text-weight-bold">{{ i18nParts.start }}</span>
                </template>

                <template #end>
                  <span class="text-weight-bold">{{ i18nParts.end }}</span>
                </template>

                <template #state>
                  <span class="text-weight-bold">
                    {{ t(`relay.timeSlotLabel.${i18nParts.stateKey}`) }}
                  </span>
                </template>
              </i18n-t>
            </div>
          </div>

          <div>
            <q-btn
              unelevated
              color="primary"
              no-caps
              dense
              @click="openSetScheduleDialog"
            >
              {{ t('relay.setSchedule') }}
            </q-btn>
          </div>
        </div>
      </div>
    </template>
  </q-expansion-item>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import CScheduleDisplay from 'components/relay/CScheduleDisplay.vue'
import { DateTime } from 'luxon'
import { TimeUnit } from 'src/types/relay-config.interface'
import { useI18n } from 'vue-i18n'

import CSetScheduleDialog from './CSetScheduleDialog.vue'
import { useQuasar } from 'quasar'

function useSetScheduleDialog() {
  const $q = useQuasar()

  function openDialog() {
    return $q.dialog({
      component: CSetScheduleDialog,
    })
  }

  return {
    openDialog,
  }
}

function secondsToTimeUnit(timeAsSeconds: number): TimeUnit {
  const hour = Math.floor(timeAsSeconds / 3600)
  const reducedSeconds = timeAsSeconds - hour * 3600
  const minute = Math.floor(reducedSeconds / 60)
  const second = reducedSeconds - minute * 60

  return {
    hour,
    minute,
    second,
  }
}

export default defineComponent({
  components: {
    CScheduleDisplay,
  },

  props: {
    modelValue: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const width = ref(0)
    function onResize(value: { width: number }) {
      width.value = value.width
    }

    const forPresentation = computed(() => {
      return props.modelValue.map((entry) => {
        return {
          entry,
          i18nParts: {
            start: DateTime.now()
              .set(secondsToTimeUnit(entry.start))
              .toLocaleString(DateTime.TIME_WITH_SECONDS),
            end: DateTime.now()
              .set(secondsToTimeUnit(entry.end))
              .toLocaleString(DateTime.TIME_WITH_SECONDS),

            // Need to force this to lowercase since lowercase state text is used in relay.timeSlotLabel
            stateKey: entry.state.toLowerCase(),
          },
        }
      })
    })

    const { t } = useI18n()
    const { openDialog: openSetScheduleDialog } = useSetScheduleDialog()

    return {
      width,
      onResize,
      SCHEDULE_BAR_HEIGHT: 10,
      forPresentation,
      t,
      openSetScheduleDialog,
    }
  },
})
</script>
