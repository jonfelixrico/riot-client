<template>
  <q-expansion-item>
    <template #header>
      <div
        :style="{ height: `${SCHEDULE_BAR_HEIGHT}px` }"
        class="relative-position"
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
    </template>

    <template #default>
      <div class="row">
        <div class="col q-gutter-y-sm">
          <div
            v-for="{ entry, i18nParts } in forPresentation"
            :key="`${entry.start}-${entry.end}`"
          >
            <i18n-t keypath="relay.timeSlotLabel">
              <template #start>
                <span class="text-weight-bold">{{ i18nParts.start }}</span>
              </template>

              <template #end>
                <span class="text-weight-bold">{{ i18nParts.end }}</span>
              </template>

              <template #state>
                <span class="text-weight-bold">{{ i18nParts.state }}</span>
              </template>
            </i18n-t>
          </div>
        </div>
        <div>
          <!-- edit button goes here -->
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
            state: entry.state.toLowerCase(),
          },
        }
      })
    })

    return {
      width,
      onResize,
      SCHEDULE_BAR_HEIGHT: 10,
      forPresentation,
    }
  },
})
</script>
