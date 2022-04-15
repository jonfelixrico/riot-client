<template>
  <div>
    <CScheduleDisplay
      v-model:activeIndex="activeIndex"
      :items="forPresentation"
    />
    <div v-if="activeEntry">
      <div>
        <q-range v-model="rangeModel" :min="0" :max="MAX_SECONDS" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import { useScheduleEntryDeleteHandler } from './schedule-entry-delete-handler.composable'
import { ScheduleEntryForEditing } from './relay-edit.types'
import { uid } from 'quasar'
import { useScheduleEntryResizeHandler } from './schedule-entry-resize-handler.composable'
import CScheduleDisplay from 'components/relay/CScheduleDisplay.vue'
import { MAX_SECONDS } from '../relay/relay.constants'

export default defineComponent({
  components: {
    CScheduleDisplay,
  },

  props: {
    modelValue: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const snapshot = ref<ScheduleEntryForEditing[]>([])
    /*
     * Can't use watchEffect here because it will cause a loop since the watch
     * will be triggered if snapshot.value is mutated.
     */
    watch(props.modelValue, (value) => {
      snapshot.value = cloneDeep(value).map((entry) => {
        return {
          ...entry,
          id: uid(),
        }
      })
    })

    const { handleDelete: deleteEntry } =
      useScheduleEntryDeleteHandler(snapshot)

    const activeEntryId = ref<string | null>(null)
    function setActiveEntry(index: number) {
      const entry = snapshot.value[index]
      activeEntryId.value === entry.id
    }

    const activeEntry = computed(
      () =>
        snapshot.value.find(
          ({ id }) => id === activeEntryId.value
        ) as ScheduleEntryForEditing
    )

    const activeIndex = computed({
      get: () =>
        snapshot.value.findIndex(({ id }) => id === activeEntryId.value),
      set: setActiveEntry,
    })

    const { editModel, resizeChangesPreview } = useScheduleEntryResizeHandler(
      snapshot,
      activeEntry
    )

    const rangeModel = computed({
      get() {
        const { start, end } = editModel.value ?? {}
        return {
          min: start ?? 0,
          max: end ?? MAX_SECONDS,
        }
      },

      set({ min, max }) {
        if (!editModel.value) {
          return
        }

        editModel.value = {
          end: max,
          start: min,
        }
      },
    })

    function saveChanges() {
      emit('update:modelValue', snapshot.value)
    }

    const forPresentation = computed(
      () => resizeChangesPreview.value ?? snapshot.value
    )

    return {
      forPresentation,
      deleteEntry,
      saveChanges,
      setActiveEntry,
      activeIndex,
      activeEntry,
      rangeModel,
      MAX_SECONDS,
    }
  },
})
</script>
