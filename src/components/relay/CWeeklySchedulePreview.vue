<template>
  <CHorizontalSchedulePreview :now="now" :entries="forPresentation" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WeeklySchedule } from 'src/types/relay-config.interface'
import {
  processScheduleEntries,
  ScheduleEntryWithDateTime,
} from 'src/utils/relay-schedule.utils'
import { reduce, sortBy } from 'lodash'
import { computed } from '@vue/reactivity'
import {
  fillGapsInSchedule,
  transformForPresentation,
} from './relay-schedule-presentation.utils'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { DateTime } from 'luxon'

type WeeklyScheduleObj = WeeklySchedule['weeklySchedule']

interface ExtendedWeeklySchedule extends WeeklyScheduleObj {
  sun: ScheduleEntryWithDateTime[]
  mon: ScheduleEntryWithDateTime[]
  tues: ScheduleEntryWithDateTime[]
  wed: ScheduleEntryWithDateTime[]
  thurs: ScheduleEntryWithDateTime[]
  fri: ScheduleEntryWithDateTime[]
  sat: ScheduleEntryWithDateTime[]
}

const DOW_INDEX_TO_DOW_STR: Record<number, keyof ExtendedWeeklySchedule> = {
  1: 'mon',
  2: 'tues',
  3: 'wed',
  4: 'thurs',
  5: 'fri',
  6: 'sat',
  7: 'sun',
}

function generateWeeklySchedule(
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
  props: {
    utcOffset: {
      type: String as PropType<WeeklySchedule['utcOffset']>,
      required: true,
    },

    weeklySchedule: {
      type: Object as PropType<WeeklySchedule['weeklySchedule']>,
      required: true,
    },

    now: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const dowNow = computed(() => DOW_INDEX_TO_DOW_STR[props.now.weekday])

    const processedWeeklySchedule = computed(() => {
      const { utcOffset, weeklySchedule } = props

      /*
       * We could process the weekly schedules separately per DOW, but in the end
       * we'll end up flattening them still. It's simpler to just flatten them now and
       * just chuck them as a single array.
       */
      const flattened = Object.values(weeklySchedule).flat()
      const processed = processScheduleEntries(flattened, utcOffset)

      /*
       * Here, we're regenerating the lost DOW grouping. The DOW grouping here respects
       * the DOW of the localized intervals.
       */
      return generateWeeklySchedule(processed)
    })

    const todaySchedule = computed(
      () => processedWeeklySchedule.value[dowNow.value]
    )

    const forPresentation = computed(() => {
      const transformed = transformForPresentation(todaySchedule.value)
      return fillGapsInSchedule(transformed)
    })

    return {
      forPresentation,
    }
  },

  components: { CHorizontalSchedulePreview },
})
</script>
