<template>
  <CHorizontalSchedulePreview :now="now" :entries="transformed" />
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { DailySchedule } from 'src/types/relay-config.interface'
import CHorizontalSchedulePreview from './CHorizontalSchedulePreview.vue'
import { processScheduleEntriesV2 } from 'src/utils/relay-schedule.utils'
import { transformScheduleEntryForPresentation } from './relay-schedule-presentation.utils'
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
      const localized = processScheduleEntriesV2(
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

      const forPresentation = localized.map(
        transformScheduleEntryForPresentation
      )

      return sortBy(forPresentation, ['start'])
    })

    return {
      transformed,
    }
  },
})
</script>
