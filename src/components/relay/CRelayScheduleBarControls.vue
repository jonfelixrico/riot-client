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
      <div
        class="control start"
        :class="orientation"
        v-touch-pan.prevent.mouse="handleStartPan"
      />
      <div
        class="control end"
        :class="orientation"
        v-touch-pan.prevent.mouse="handleEndPan"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext, computed } from 'vue'
import { MAX_SECONDS } from './CRelayScheduleBar.vue'
import { Orientation } from './schedule-bar.types'

interface PropAttrs {
  startSeconds: number
  endSeconds: number
  width: number
  height: number
  orientation: Orientation
}

interface PartialVTouchPanEvent {
  distance: {
    x: number
    y: number
  }
  isFirst: boolean
  isFinal: boolean
}

type EmitTypes = 'update:startSeconds' | 'update:endSeconds'
const EMITS: EmitTypes[] = ['update:startSeconds', 'update:endSeconds']

function usePanHandlers(props: PropAttrs, { emit }: SetupContext<EmitTypes[]>) {
  const offset = computed({
    get() {
      const percentage = props.startSeconds / MAX_SECONDS
      if (props.orientation === 'horizontal') {
        return percentage * props.width
      }

      return percentage * props.height
    },

    set(value: number) {
      if (props.orientation === 'horizontal') {
        emit('update:startSeconds', (value * MAX_SECONDS) / props.width)
        return
      }

      emit('update:startSeconds', (value * MAX_SECONDS) / props.height)
    },
  })

  const size = computed({
    get() {
      const percentage = (props.endSeconds - props.startSeconds) / MAX_SECONDS

      if (props.orientation === 'horizontal') {
        return percentage * props.width
      }

      return percentage * props.height
    },

    set(value: number) {
      if (props.orientation === 'horizontal') {
        emit(
          'update:endSeconds',
          (value * MAX_SECONDS) / props.width + props.startSeconds
        )
        return
      }

      emit(
        'update:endSeconds',
        (value * MAX_SECONDS) / props.height + props.startSeconds
      )
    },
  })

  let initialOffset = 0
  function handleStartPan({
    isFirst,
    isFinal,
    distance,
  }: PartialVTouchPanEvent) {
    if (isFirst) {
      initialOffset = offset.value
      if (props.orientation === 'horizontal') {
        offset.value = initialOffset + distance.x
      } else {
        offset.value = initialOffset + distance.y
      }
    } else if (isFinal) {
      if (props.orientation === 'horizontal') {
        offset.value = initialOffset + distance.x
      } else {
        offset.value = initialOffset + distance.y
      }

      initialOffset = 0
    } else {
      if (props.orientation === 'horizontal') {
        offset.value = initialOffset + distance.x
      } else {
        offset.value = initialOffset + distance.y
      }
    }
  }

  let initialSize = 0
  function handleEndPan({ isFirst, isFinal, distance }: PartialVTouchPanEvent) {
    if (isFirst) {
      initialSize = size.value
      if (props.orientation === 'horizontal') {
        size.value = initialSize + distance.x
      } else {
        size.value = initialSize + distance.y
      }
    } else if (isFinal) {
      if (props.orientation === 'horizontal') {
        size.value = initialSize + distance.x
      } else {
        size.value = initialSize + distance.y
      }

      initialSize = 0
    } else {
      if (props.orientation === 'horizontal') {
        size.value = initialSize + distance.x
      } else {
        size.value = initialSize + distance.y
      }
    }
  }

  return {
    handleStartPan,
    handleEndPan,
  }
}

function useStyleComputedProps(props: PropAttrs) {
  const sizeStyles = computed(() => {
    const { startSeconds, endSeconds, height, width, orientation } = props
    const percentage = (endSeconds - startSeconds) / MAX_SECONDS

    if (orientation === 'horizontal') {
      return {
        width: `${percentage * width}px`,
        height: `${height}px`,
      }
    }

    return {
      height: `${percentage * height}px`,
      width: `${width}px`,
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
}

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

  emits: EMITS,

  setup(props, context) {
    return {
      ...useStyleComputedProps(props),
      ...usePanHandlers(props, context),
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
