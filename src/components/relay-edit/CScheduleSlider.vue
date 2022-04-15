<template>
  <q-slider
    v-if="modelValue.start === 0"
    v-model="sliderModel"
    :min="0"
    :max="MAX_SECONDS"
    data-cy="slider"
    data-type="slider"
  />

  <q-slider
    v-else-if="modelValue.end === MAX_SECONDS"
    v-model="reverseSliderModel"
    reverse
    :min="0"
    :max="MAX_SECONDS"
    data-cy="slider"
    data-type="reverse-slider"
  />

  <q-range
    v-else
    v-model="rangeModel"
    :min="0"
    :max="MAX_SECONDS"
    data-cy="slider"
    data-type="range"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from '../relay/relay.constants'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<PresentationScheduleEntry>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const reverseSliderModel = computed<number>({
      get() {
        return MAX_SECONDS - props.modelValue.start
      },

      set(value) {
        emit('update:modelValue', {
          ...props.modelValue,
          start: MAX_SECONDS - value,
        })
      },
    })

    const sliderModel = computed<number>({
      get() {
        return props.modelValue.end
      },

      set(end) {
        emit('update:modelValue', {
          ...props.modelValue,
          end,
        })
      },
    })

    const rangeModel = computed({
      get() {
        const { start, end } = props.modelValue
        return {
          min: start,
          max: end,
        }
      },

      set({ min, max }) {
        emit('update:modelValue', {
          ...props.modelValue,
          start: min,
          end: max,
        })
      },
    })

    return {
      reverseSliderModel,
      sliderModel,
      rangeModel,
      MAX_SECONDS,
    }
  },
})
</script>
