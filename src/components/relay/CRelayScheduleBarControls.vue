<template>
  <div
    :style="{
      width: `${width}px`,
      height: `${height}px`,
    }"
    class="relative-position"
  >
    <div
      class="absolute justify-between"
      :class="{
        row: orientation === 'horizontal',
        column: orientation === 'vertical',
      }"
      :style="[offsetStyles, sizeStyles]"
    >
      <div class="control start" :class="orientation" />
      <div class="control end" :class="orientation" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { defineComponent, PropType } from 'vue'
import { MAX_SECONDS } from './CRelayScheduleBar.vue'
import { Orientation } from './schedule-bar.types'

export default defineComponent({
  props: {
    startSeconds: {
      type: Number,
      required: true,
    },

    endSeconds: {
      type: Number,
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
      type: String as PropType<Orientation>,
      default: 'vertical',
    },

    color: String,
  },

  emits: ['update:startSeconds', 'update:endSeconds'],

  setup(props) {
    const sizeStyles = computed(() => {
      const { startSeconds, endSeconds, height, width, orientation } = props
      const percentage = (endSeconds - startSeconds) / MAX_SECONDS

      if (orientation === 'horizontal') {
        return {
          width: `${percentage * width}px`,
        }
      }

      return {
        height: `${percentage * height}px`,
      }
    })

    const offsetStyles = computed(() => {
      const { startSeconds, height, width, orientation } = props
      const percentage = startSeconds / MAX_SECONDS

      if (orientation === 'horizontal') {
        return {
          left: `${percentage * width}px`,
        }
      }

      return {
        top: `${percentage * height}px`,
      }
    })

    return {
      sizeStyles,
      offsetStyles,
    }
  },
})
</script>

<style lang="scss" scoped>
$border-width: 2px;

.control {
  // Intended to be overridden by the `color` prop.
  color: $grey-10;

  border-style: solid;

  &.start {
    &.horizontal {
      border-left-width: $border-width;
    }

    &.vertical {
      border-top-width: $border-width;
    }
  }

  &.end {
    &.horizontal {
      border-right-width: $border-width;
    }

    &.vertical {
      border-left-width: $border-width;
    }
  }
}
</style>
