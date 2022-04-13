<template>
  <CSchedulePreview
    :originalUtcOffset="utcOffset"
    :scheduleEntries="dailySchedule"
    :now="now"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DailySchedule } from 'src/types/relay-config.interface'
import CSchedulePreview from './CSchedulePreview.vue'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'

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
  components: { CSchedulePreview },

  setup() {
    const { now } = useTickingDateTime()

    return {
      now,
    }
  },
})
</script>
