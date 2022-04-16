<template>
  <div>
    <CScheduleDisplay
      v-model:activeIndex="selectedIndex"
      :items="forPresentation"
      clickable
    />
    <div v-if="selectedEntry">
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
    watch(
      props.modelValue,
      (value) => {
        snapshot.value = cloneDeep(value).map((entry) => {
          return {
            ...entry,
            id: uid(),
          }
        })
      },
      { immediate: true }
    )

    const selectedId = ref<string | null>(null)
    const selectedIndex = computed({
      get: () => snapshot.value.findIndex(({ id }) => id === selectedId.value),
      set(index) {
        const entry = snapshot.value[index]
        selectedId.value = entry.id
      },
    })

    const selectedEntry = computed(
      () => snapshot.value[selectedIndex.value] ?? null
    )

    const { handleDelete: deleteEntry } = useScheduleEntryDeleteHandler(
      snapshot,
      selectedId
    )

    const {
      rangeModel,
      resizeChangesPreview,
      saveChanges: saveResizeChanges,
    } = useScheduleEntryResizeHandler(snapshot, selectedId)

    function saveChanges() {
      emit('update:modelValue', snapshot.value)
    }

    const forPresentation = computed(
      () => resizeChangesPreview.value ?? snapshot.value
    )

    return {
      forPresentation,

      // general model-related
      saveChanges,

      // delete-related
      deleteEntry,

      // resize-related
      rangeModel,
      saveResizeChanges,

      selectedIndex,
      selectedEntry,

      MAX_SECONDS,
    }
  },
})
</script>
