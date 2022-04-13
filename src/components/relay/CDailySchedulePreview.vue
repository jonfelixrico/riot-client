<template>
  <CHorizontalSchedulePreview :now="now" :entries="transformed" />
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { DailySchedule } from 'src/types/relay-config.interface'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'
import { processScheduleEntries } from 'src/utils/relay-schedule.utils'
import {
  transformForPresentation,
  fillGapsInSchedule,
  PresentationScheduleEntry,
} from './relay-schedule-presentation.utils'
import { sortBy } from 'lodash'

export default defineComponent({
  props: {
    utcOffset: {
      type: String as PropType<DailySchedule['utcOffset']>,
      required: true,
    },
    dailySchedule: {
      type: Array as PropType<DailySchedule['dailySchedule']>,
      required: true,
    },
  },
  components: { CHorizontalSchedulePreview },

  setup(props) {
    const { now } = useTickingDateTime()

    const transformed = computed(() => {
      const { dailySchedule, utcOffset } = props
      const processed = processScheduleEntries(dailySchedule, utcOffset)
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
      now,
      transformed,
    }
  },
})
</script>
