<template>
  <div class="relative">this is a stub for weekly</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WeeklySchedule } from 'src/types/relay-config.interface'

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
  },
})
</script>
