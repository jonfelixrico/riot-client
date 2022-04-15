<template>
  <div>stub</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { ScheduleEntry } from 'types/relay-config.interface'
import { cloneDeep } from 'lodash'
import { computed } from '@vue/reactivity'
import { transformScheduleEntryForPresentation } from '../relay/relay-schedule-presentation.utils'
import { useScheduleEntryDeleteHandler } from './schedule-entry-delete-handler.composable'

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<ScheduleEntry[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const snapshot = ref<ScheduleEntry[]>([])

    watch(props.modelValue, () => {
      snapshot.value = cloneDeep(props.modelValue)
    })

    const forPresentation = computed(() => {
      return snapshot.value.map(transformScheduleEntryForPresentation)
    })

    const { handleDelete: deleteEntry } =
      useScheduleEntryDeleteHandler(snapshot)

    function saveChanges() {
      emit('update:modelValue', snapshot.value)
    }

    return {
      forPresentation,
      deleteEntry,
      saveChanges,
    }
  },
})
</script>
