<template>
  <div>stub</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { ScheduleEntry } from 'types/relay-config.interface'
import { cloneDeep } from 'lodash'

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<ScheduleEntry[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props) {
    const snapshot = ref<ScheduleEntry[]>([])

    watch(props.modelValue, () => {
      snapshot.value = cloneDeep(props.modelValue)
    })
  },
})
</script>
