<template>
  <div
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
    class="relative-position"
    :class="{
      row: orientation === 'horizontal',
      column: orientation === 'vertical',
    }"
  >
    <div
      v-for="{ id, state, ...interval } of items"
      :key="id"
      :data-item-id="id"
      data-cy="item"
      :style="[containerDependentStyles, getSizingStyles(interval)]"
      class="item"
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

    function getSizingStyles({
      start,
      end,
    }: Pick<ScheduleBarItem, 'start' | 'end'>) {
      const { orientation, height, width } = props

      const sizePercent = (end - start) / MAX_SECONDS

      if (orientation === 'horizontal') {
        return {
          width: `${width * sizePercent}px`,
        }
      }

      return {
        height: `${height * sizePercent}px`,
      }
    }

    return {
      containerDependentStyles,
      getSizingStyles,
    }
  },
})
</script>

<style scope lang="scss">
.item {
  &.on {
    background: $green-5;
  }

  &.off {
    background: $red-5;
  }

  background: $grey-5;
}
</style>
