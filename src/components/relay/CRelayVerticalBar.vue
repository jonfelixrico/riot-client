<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="relative-position"
  >
    <div
      v-for="({ end, heightPercent, offsetPercent, state }, index) of intervals"
      :key="index"
      data-cy="interval"
      :data-end="end"
      :style="{
        width: `${width}px`,
        height: `${heightPercent * height}px`,
        top: `${offsetPercent * height}px`,
      }"
      class="absolute interval"
      :class="{
        on: state === 'ON',
        off: state === 'OFF',
      }"
      :data-state="state ?? 'NULL'"
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
  heightPercent: number
  offsetPercent: number
}

function convert({ hour, second, minute }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}

const MAX_SECONDS = 3600 * 24

export default defineComponent({
  props: {
    schedule: {
      type: Array as PropType<DisplaySchedule[]>,
      required: true,
    },

    currentTime: Object as PropType<TimeUnit>,

    width: {
      type: Number,
      default: 50,
    },

    height: {
      type: Number,
      default: 300,
    },
  },

  setup(props) {
    const intervals = computed<Interval[]>(() => {
      const { schedule } = props

      return schedule.map((sched) => {
        const startSeconds = convert(sched.start)
        const endSeconds = convert(sched.end)

        const heightPercent = (endSeconds - startSeconds) / MAX_SECONDS
        const offsetPercent = startSeconds / MAX_SECONDS

        return {
          ...sched,
          startSeconds,
          endSeconds,
          heightPercent,
          offsetPercent,
        }
      })
    })

    return {
      intervals,
    }
  },
})
</script>

<style scope lang="scss">
.interval {
  &.on {
    background: $green-5;
  }

  &.off {
    background: $red-5;
  }

  background: $grey-5;
}
</style>
