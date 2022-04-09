<template>
  <div :style="{ width: `${width}px`, height: `${height}px` }">
    <div
      v-for="({ start, end, state }, index) of intervals"
      :key="index"
      data-cy="interval"
      :data-state="state"
      :data-start="start"
      :data-end="end"
      :style="{ width: `${width}px`, height: `${height}px` }"
    />
  </div>
</template>

<script lang="ts">
import { DisplaySchedule } from 'src/utils/daily-relay-schedule.utils'
import { TimeUnit } from 'src/utils/relay-schedule.utils'
import { computed, defineComponent, PropType } from 'vue'

interface Interval extends DisplaySchedule {
  startSeconds: number
  endSeconds: number
}

function convert({ hour, second, minute }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}
export default defineComponent({
  props: {
    schedule: {
      type: Array as PropType<DisplaySchedule[]>,
      required: true,
    },

    currentTime: Object as PropType<TimeUnit>,

    width: {
      type: Number,
      default: 200,
    },

    height: {
      type: Number,
      default: 300,
    },
  },

  setup(props) {
    const intervals = computed<Interval[]>(() =>
      props.schedule.map((sched) => {
        return {
          ...sched,
          startSeconds: convert(sched.start),
          endSeconds: convert(sched.end),
        }
      })
    )

    return {
      intervals,
    }
  },
})
</script>
