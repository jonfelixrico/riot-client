import { cloneDeep } from 'lodash'
import { computed, ref, Ref, watch } from 'vue'
import { ScheduleEntryForEditing } from './relay-edit.types'

export function useScheduleEntryResizeHandler(
  entries: Ref<ScheduleEntryForEditing[]>,
  activeEntry: Ref<ScheduleEntryForEditing | null>
) {
  const snapshot: Ref<ScheduleEntryForEditing | null> = ref(null)
  watch(activeEntry, (entry) => {
    if (!entry) {
      snapshot.value = null
      return
    }

    snapshot.value = cloneDeep(entry)
  })

  const editModel = computed({
    get() {
      if (!snapshot.value) {
        return null
      }

      const { start, end } = snapshot.value
      return {
        start,
        end,
      }
    },

    set(newValue: { start: number; end: number } | null) {
      if (!snapshot.value) {
        console.warn(
          'useScheduleEntryResizeHandler: editModel was mutated even if there is no active entry'
        )
        return
      } else if (!newValue) {
        console.warn('useScheduleEntryResizeHandler: not accepting nulls')
        return
      }

      snapshot.value = {
        ...snapshot.value,
        ...newValue,
      }
    },
  })

  return {
    editModel,
  }
}
