<template>
  <q-range v-if="startModel !== 0 && endModel !== 0" v-model="rangeModel" />
  <q-slider v-else-if="startModel === 0" v-model="endModel" />
  <q-slider v-else-if="endModel === 0" v-model="startModel" reverse />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<PresentationScheduleEntry>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const startModel = computed<number>({
      get() {
        return props.modelValue.start
      },

      set(start) {
        emit('update:modelValue', {
          ...props.modelValue,
          start,
        })
      },
    })

    const endModel = computed<number>({
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
      startModel,
      endModel,
      rangeModel,
    }
  },
})
</script>
