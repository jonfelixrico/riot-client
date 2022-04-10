<template>
  <div
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
    class="relative-position"
  >
    <div
      v-for="{ id, state, ...interval } of items"
      :key="id"
      data-cy="interval"
      :style="[
        containerDependentStyles,
        getSizingAndPositioningStyles(interval),
      ]"
      class="absolute interval"
      :class="{
        on: state === 'ON',
        off: state === 'OFF',
      }"
      :data-state="state ?? 'UNOCCUPIED'"
    />
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'
import { ScheduleBarItem } from './schedule-bar.types'

export const MAX_SECONDS = 3600 * 24 - 1

type RelayScheduleBarOrientation = 'horizontal' | 'vertical'

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<ScheduleBarItem[]>,
      required: true,
    },

    currentTime: Number,

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

  setup(props) {
    /**
     * These styles will make each item take the entire height of the
     * container if orientation is horizontal. If set to vertical, then
     * the width is taken instead. You can treat this as the align-item
     * flexbox property.
     */
    const containerDependentStyles = computed(() => {
      const { orientation, height, width } = props

      if (orientation === 'horizontal') {
        return {
          height: `${height}px`,
        }
      }

      return {
        width: `${width}px`,
      }
    })

    function getSizingAndPositioningStyles({
      start,
      end,
    }: Pick<ScheduleBarItem, 'start' | 'end'>) {
      const { orientation, height, width } = props

      const offsetPercent = start / MAX_SECONDS
      const sizePercent = (end - start) / MAX_SECONDS

      if (orientation === 'horizontal') {
        return {
          left: `${width * offsetPercent}px`,
          width: `${width * sizePercent}`,
        }
      }

      return {
        top: `${height * offsetPercent}`,
        height: `${height * sizePercent}`,
      }
    }

    return {
      containerDependentStyles,
      getSizingAndPositioningStyles,
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
