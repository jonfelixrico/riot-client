<template>
  <div class="q-gutter-y-sm">
    <div
      v-for="day of DISPLAY_SEQUENCE"
      :key="day"
      class="row items-center q-col-gutter-x-sm"
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
import {
  processScheduleEntries,
  ScheduleEntryWithDateTime,
} from 'src/utils/relay-schedule.utils'
import { mapValues, reduce, sortBy } from 'lodash'
import { computed } from '@vue/reactivity'
import {
  fillGapsInSchedule,
  transformForPresentation,
} from './relay-schedule-presentation.utils'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import { ExtendedWeeklySchedule } from './relay.types'

const DOW_INDEX_TO_DOW_STR: Record<number, keyof ExtendedWeeklySchedule> = {
  1: 'mon',
  2: 'tues',
  3: 'wed',
  4: 'thurs',
  5: 'fri',
  6: 'sat',
  7: 'sun',
}

const DISPLAY_SEQUENCE: Array<keyof ExtendedWeeklySchedule> = [
  'mon',
  'tues',
  'wed',
  'thurs',
  'fri',
  'sat',
  'sun',
]

function groupScheduleByDow(
  sched: ScheduleEntryWithDateTime[]
): ExtendedWeeklySchedule {
  const sorted = sortBy(sched, ({ start }) => start.toMillis())

  return reduce(
    sorted,
    (acc, val) => {
      const dayOfWeek = val.start.weekday
      const key = DOW_INDEX_TO_DOW_STR[dayOfWeek]

      const entryInAcc = acc[key]
      entryInAcc.push(val)

      return acc
    },
    {
      mon: [],
      tues: [],
      wed: [],
      thurs: [],
      fri: [],
      sat: [],
      sun: [],
    } as ExtendedWeeklySchedule
  )
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
    const dowNow = computed(() => DOW_INDEX_TO_DOW_STR[props.now.weekday])
    const zoneName = computed(() => props.now.zoneName)

    const schedules = computed(() => {
      const { utcOffset, weeklySchedule } = props

      /*
       * We could process the weekly schedules separately per DOW, but in the end
       * we'll end up flattening them still. It's simpler to just flatten them now and
       * just chuck them as a single array.
       */
      const flattened = Object.values(weeklySchedule).flat()
      const processed = processScheduleEntries(
        flattened,
        utcOffset,
        /*
         * Do NOT use props.now.zoneName directly here because it will
         * cause this computed to keep on re-computing each update of now.
         *
         * We created the `targetZone` computed ref because even if the value
         * of now changes, it will not cause unnecessary recomputes in this computed
         * ref as long as the zone of the new value of `now` is the same as the old one.
         */
        zoneName.value
      )

      /*
       * Here, we're regenerating the lost DOW grouping. The DOW grouping here respects
       * the DOW of the localized intervals.
       */
      const regrouped = groupScheduleByDow(processed)

      return mapValues(regrouped, (scheduleArr) => {
        const transformed = transformForPresentation(scheduleArr)
        return fillGapsInSchedule(transformed)
      })
    })

    const { t } = useI18n()

    return {
      DISPLAY_SEQUENCE,
      dowNow,
      schedules,
      t,
    }
  },
})
</script>
