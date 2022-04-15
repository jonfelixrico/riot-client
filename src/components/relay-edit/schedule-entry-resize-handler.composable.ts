import { cloneDeep } from 'lodash'
import { uid } from 'quasar'
import { computed, ref, Ref, watch } from 'vue'
import { MAX_SECONDS } from '../relay/relay.constants'
import { ScheduleEntryForEditing } from './relay-edit.types'

function mergeEntries(entries: ScheduleEntryForEditing[]) {
  const containsMerged: ScheduleEntryForEditing[] = []

  for (const entry of cloneDeep(entries)) {
    const lastItem = containsMerged[containsMerged.length - 1]

    if (!lastItem) {
      containsMerged.push(entry)
    } else if (
      entry.start - lastItem.end === 1 &&
      entry.state === lastItem.state
    ) {
      lastItem.end = entry.end
    } else {
      containsMerged.push(entry)
    }
  }

  return containsMerged
}

export function useScheduleEntryResizeHandler(
  entriesRef: Ref<ScheduleEntryForEditing[]>,
  activeEntryRef: Ref<ScheduleEntryForEditing | null>
) {
  const snapshot: Ref<ScheduleEntryForEditing | null> = ref(null)
  watch(
    activeEntryRef,
    (entry) => {
      if (!entry) {
        snapshot.value = null
        return
      }

      snapshot.value = cloneDeep(entry)
    },
    {
      immediate: true,
    }
  )

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

  const resizeChangesPreview = computed(() => {
    const { value: activeEntry } = activeEntryRef
    if (!activeEntry) {
      return null
    }

    const { value: entries } = entriesRef
    const activeEntryIndex = entries.findIndex(
      (entry) => entry.id === activeEntry.id
    )

    /*
     * Collect entries which are not overlapped by the active entry, or only
     * partially overlapped. These items will be included in the final results in some form.
     *
     * Items completely overlapped by the active entry are considered as deleted.
     */
    const left = entries.filter((entry) => {
      return entry.start < activeEntry.start || entry.end < activeEntry.start
    })
    const right = entries.filter((entry) => {
      return entry.start > activeEntry.end || entry.end > activeEntry.end
    })

    const notOverlappedLeft = left.slice(0, left.length - 1)
    // Only adjacent values are overlapped. TODO add a mathematically-backed explanation for this
    const overlappedLeft = left[left.length - 1]

    const notOverlappedRight = right.slice(1, right.length)
    // Only adjacent values are overlapped. TODO add a mathematically-backed explanation for this
    const overlappedRight = right[0]

    const results: ScheduleEntryForEditing[] = []

    const inverseState = activeEntry.state === 'OFF' ? 'ON' : 'OFF'

    if (activeEntryIndex === 0 && activeEntry.start > 0) {
      results.push({
        start: 0,
        end: activeEntry.start - 1,
        state: inverseState,
        id: uid(),
      })
    } else {
      results.push(...notOverlappedLeft)

      results.push({
        ...overlappedLeft,
        end: activeEntry.start - 1,
      })
    }

    results.push(activeEntry)

    if (activeEntryIndex === entries.length - 1) {
      results.push({
        start: activeEntry.end + 1,
        end: MAX_SECONDS,
        id: uid(),
        state: inverseState,
      })
    } else {
      results.push({
        ...overlappedRight,
        start: activeEntry.end + 1,
      })

      results.push(...notOverlappedRight)
    }

    return mergeEntries(results)
  })

  return {
    editModel,
    resizeChangesPreview,
  }
}
