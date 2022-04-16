<template>
  <div>stub</div>
</template>

<script lang="ts">
import { DailySchedule, WeeklySchedule } from 'src/types/relay-config.interface'
import { defineComponent, PropType } from 'vue'

type Schedule = {
  utcOffset: string
} & (DailySchedule | WeeklySchedule)

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<Schedule>,
      required: true,
    },
  },

  emits: ['update:modelValue'],
})
</script>
