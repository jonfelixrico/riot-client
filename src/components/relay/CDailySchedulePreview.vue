<template>
  <div class="relative">this is a stub</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DailySchedule } from 'src/types/relay-config.interface'

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
})
</script>
