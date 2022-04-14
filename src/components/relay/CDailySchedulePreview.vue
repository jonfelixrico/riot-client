<template>
  <CHorizontalSchedulePreview :now="now" :entries="transformed" />
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { DailySchedule } from 'src/types/relay-config.interface'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { processScheduleEntries } from 'src/utils/relay-schedule.utils'
import {
  transformForPresentation,
  fillGapsInSchedule,
  PresentationScheduleEntry,
} from './relay-schedule-presentation.utils'
import { sortBy } from 'lodash'
import { DateTime } from 'luxon'

export default defineComponent({
  components: { CHorizontalSchedulePreview },

  props: {
    /**
     * The UTC offset of each of the schedule entries.
     */
    utcOffset: {
      type: String as PropType<DailySchedule['utcOffset']>,
      required: true,
    },

    dailySchedule: {
      type: Array as PropType<DailySchedule['dailySchedule']>,
      required: true,
    },

    /**
     * Represents the current time. The `dailySchedule` prop will have its time
     * converted to the timezone of the current time.
     */
    now: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const targetZone = computed(() => props.now.zoneName)

    const transformed = computed(() => {
      const { dailySchedule, utcOffset } = props

      // Can have multi-day items due to timezone conversion
      const processed = processScheduleEntries(
        dailySchedule,
        utcOffset,
        /*
         * Do NOT use props.now.zoneName directly here because it will
         * cause this computed to keep on re-computing each update of now.
         *
         * We created the `targetZone` computed ref because even if the value
         * of now changes, it will not cause unnecessary recomputes in this computed
         * ref as long as the zone of the new value of `now` is the same as the old one.
         */
        targetZone.value
      )

      /**
       * Will end up ignoring the date part and will keep only the
       * time part of the processed data. Time data may not be unsorted tho.
       *
       * The case where the data is unsorted can be caused by this scenario:
       *
       * Processed has two items:
       * start: 2022-01-01T12:00:00Z
       * end: 2022-01-01T23:59:59Z
       *
       * start: 2022-01-2T00:00:00Z
       * end: 2022-01-02T12:00:00Z
       *
       * Once {@link transformForPresentation} is executed, the data when represented
       * as time, will end up like this:
       *
       * start: 12:00:00
       * end: 23:59:59
       *
       * start: 00:00:00
       * end: 12:00:00
       *
       * This is expected due to the original data above. To fix this quirk, we just
       * have to sort them by start times to make the data adhere to the business logic
       * again.
       */
      const transformed = transformForPresentation(processed)
      const sorted = sortBy(transformed, 'start')

      const merged = sorted.reduce<PresentationScheduleEntry[]>(
        (arr, entry) => {
          if (!arr.length) {
            arr.push(entry)
            return arr
          }

          const lastItemIdx = arr.length - 1
          const lastItem = arr[lastItemIdx]
          if (
            lastItem.state === entry.state &&
            entry.start - lastItem.end === 1
          ) {
            arr.splice(lastItemIdx, 1, {
              ...lastItem,
              end: entry.end,
            })
          } else {
            arr.push(entry)
          }

          return arr
        },
        []
      )

      return fillGapsInSchedule(merged)
    })

    return {
      transformed,
    }
  },
})
</script>
