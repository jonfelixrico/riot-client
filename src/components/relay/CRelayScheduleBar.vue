<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="relative-position"
  >
    <div
      v-for="(entry, index) of schedule"
      :key="index"
      data-cy="interval"
      :style="[
        {
          width: `${width}px`,
        },
        getBarStyle(entry, height),
      ]"
      class="absolute interval"
      :class="{
        on: entry.state === 'ON',
        off: entry.state === 'OFF',
      }"
      :data-state="entry.state ?? 'NULL'"
    />
  </div>
</template>

<script lang="ts">
import { DisplaySchedule } from 'src/utils/daily-relay-schedule.utils'
import { TimeUnit } from 'src/utils/relay-schedule.utils'
import { defineComponent, PropType } from 'vue'

function convert({ hour, second, minute }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}

const MAX_SECONDS = 3600 * 24 - 1

function getBarStyle({ start, end }: DisplaySchedule, height: number) {
  const startSeconds = convert(start)
  const endSeconds = convert(end)

  const heightPercent = (endSeconds - startSeconds) / MAX_SECONDS
  const offsetPercent = startSeconds / MAX_SECONDS

  return {
    height: `${height * heightPercent}px`,
    top: `${height * offsetPercent}px`,
  }
}

type RelayScheduleBarOrientation = 'horizontal' | 'vertical'

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

    orientation: {
      type: String as PropType<RelayScheduleBarOrientation>,
      default: 'vertical',
    },
  },

  setup() {
    return {
      getBarStyle,
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
