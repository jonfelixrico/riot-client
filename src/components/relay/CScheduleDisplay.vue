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
      v-for="({ state, ...interval }, index) of items"
      :key="index"
      :data-index="index"
      :data-active="activeIndex === index"
      data-cy="item"
      :style="[containerDependentStyles, getSizingStyles(interval)]"
      class="item"
      :class="{
        on: state === 'ON',
        off: state === 'OFF',
        active: activeIndex === index,
      }"
      :data-state="state ?? 'UNOCCUPIED'"
      @dblclick="$emit('update:activeIndex', index)"
    />
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'
import { MAX_SECONDS } from './relay.constants'
import { PresentationScheduleEntry } from './relay-schedule-presentation.utils'

type RelayScheduleBarOrientation = 'horizontal' | 'vertical'

export default defineComponent({
  props: {
    /**
     * Asumes that all seconds in the day has been occupied by one of the items here.
     * Do NOT leave any gaps or there will be a UI issue.
     */
    items: {
      type: Array as PropType<PresentationScheduleEntry[]>,
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

    activeIndex: Number,
  },

  emits: ['update:activeIndex'],

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
    }: Pick<PresentationScheduleEntry, 'start' | 'end'>) {
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

  background: $grey-4;

  &.active {
    border: 2px black solid;
  }
}
</style>
