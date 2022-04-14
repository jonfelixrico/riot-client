<template>
  <div class="q-gutter-y-sm">
    <div
      v-for="day of DISPLAY_SEQUENCE"
      :key="day"
      class="row items-center q-col-gutter-x-sm"
      :data-day="day"
      data-cy="dow-item"
      :data-current-day="dowNow === day"
    >
      <div class="col-2">
        {{ t(`relay.daysOfWeek.${day}`) }}
      </div>
      <div class="col">
        <CHorizontalSchedulePreview
          :now="dowNow === day ? now : undefined"
          :entries="schedules[day]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WeeklySchedule } from 'src/types/relay-config.interface'
import { computed } from '@vue/reactivity'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import {
  localizeWeeklySchedule,
  DayOfWeekString,
} from './weekly-schedule.utils'
import { mapValues } from 'lodash'
import { transformScheduleEntryForPresentation } from './relay-schedule-presentation.utils'

const DISPLAY_SEQUENCE: DayOfWeekString[] = [
  'mon',
  'tues',
  'wed',
  'thurs',
  'fri',
  'sat',
  'sun',
]

const DATETIME_DOW_TO_STRING_DOW: Record<DateTime['weekday'], DayOfWeekString> =
  {
    1: 'mon',
    2: 'tues',
    3: 'wed',
    4: 'thurs',
    5: 'fri',
    6: 'sat',
    7: 'sun',
  }

export default defineComponent({
  components: { CHorizontalSchedulePreview },

  props: {
    /**
     * The UTC offset of each of the entries in the weekly schedule.
     */
    utcOffset: {
      type: String as PropType<WeeklySchedule['utcOffset']>,
      required: true,
    },

    weeklySchedule: {
      type: Object as PropType<WeeklySchedule['weeklySchedule']>,
      required: true,
    },

    /**
     * Represents the current time. The `weeklySchedule` prop will have its time
     * converted to the timezone of the current time.
     */
    now: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const dowNow = computed(() => DATETIME_DOW_TO_STRING_DOW[props.now.weekday])
    const targetZone = computed(() => props.now.zoneName)

    const localized = computed(() => {
      return localizeWeeklySchedule(props, targetZone.value)
    })

    const forPresentation = computed(() => {
      return mapValues(localized.value, (entries) =>
        entries.map(transformScheduleEntryForPresentation)
      )
    })

    const { t } = useI18n()

    return {
      DISPLAY_SEQUENCE,
      dowNow,
      schedules: forPresentation,
      t,
    }
  },
})
</script>
