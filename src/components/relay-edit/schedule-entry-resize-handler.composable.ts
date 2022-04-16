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
  selectedIdRef: Ref<string | null>
) {
  const snapshotRef: Ref<ScheduleEntryForEditing | null> = ref(null)
  const selectedRef = computed(
    () =>
      entriesRef.value.find((entry) => selectedIdRef.value === entry.id) ?? null
  )

  watch(
    selectedRef,
    (entry) => {
      if (!entry) {
        snapshotRef.value = null
        return
      }

      snapshotRef.value = cloneDeep(entry)
    },
    {
      immediate: true,
    }
  )

  const editModel = computed({
    get() {
      if (!snapshotRef.value) {
        return null
      }

      const { start, end } = snapshotRef.value
      return {
        start,
        end,
      }
    },

    set(newValue: { start: number; end: number } | null) {
      if (!snapshotRef.value) {
        console.warn(
          'useScheduleEntryResizeHandler: editModel was mutated even if there is no active entry'
        )
        return
      } else if (!newValue) {
        console.warn('useScheduleEntryResizeHandler: not accepting nulls')
        return
      }

      snapshotRef.value = {
        ...snapshotRef.value,
        ...newValue,
      }
    },
  })

  const rangeModel = computed<{ min: number; max: number } | null>({
    get() {
      const { value: model } = editModel
      if (!model) {
        return null
      }

      const { start, end } = model
      return {
        min: start,
        max: end,
      }
    },

    set(value) {
      if (!value) {
        editModel.value = null
        return
      }

      const { min, max } = value
      editModel.value = {
        start: min,
        end: max,
      }
    },
  })

  const resizeChangesPreview = computed(() => {
    const { value: snapshot } = snapshotRef
    if (!snapshot) {
      return null
    }

    const { value: entries } = entriesRef
    const indexInSnapshot = entries.findIndex(
      (entry) => entry.id === snapshot.id
    )

    /*
     * Collect entries which are not overlapped by the active entry, or only
     * partially overlapped. These items will be included in the final results in some form.
     *
     * Items completely overlapped by the active entry are considered as deleted.
     */
    const left = entries.filter((entry) => {
      return entry.start < snapshot.start || entry.end < snapshot.start
    })
    const right = entries.filter((entry) => {
      return entry.start > snapshot.end || entry.end > snapshot.end
    })

    const notOverlappedLeft = left.slice(0, left.length - 1)
    // Only adjacent values are overlapped. TODO add a mathematically-backed explanation for this
    const overlappedLeft = left[left.length - 1]

    const notOverlappedRight = right.slice(1, right.length)
    // Only adjacent values are overlapped. TODO add a mathematically-backed explanation for this
    const overlappedRight = right[0]

    const results: ScheduleEntryForEditing[] = []

    const inverseState = snapshot.state === 'OFF' ? 'ON' : 'OFF'

    if (indexInSnapshot === 0 && snapshot.start > 0) {
      results.push({
        start: 0,
        end: snapshot.start - 1,
        state: inverseState,
        id: uid(),
      })
    } else {
      results.push(...notOverlappedLeft)

      if (overlappedLeft) {
        results.push({
          ...overlappedLeft,
          end: snapshot.start - 1,
          state: inverseState,
        })
      }
    }

    results.push(snapshot)

    if (indexInSnapshot === entries.length - 1 && snapshot.end < MAX_SECONDS) {
      results.push({
        start: snapshot.end + 1,
        end: MAX_SECONDS,
        id: uid(),
        state: inverseState,
      })
    } else {
      if (overlappedRight) {
        results.push({
          ...overlappedRight,
          start: snapshot.end + 1,
          state: inverseState,
        })
      }

      results.push(...notOverlappedRight)
    }

    return mergeEntries(results)
  })

  function saveChanges() {
    const { value } = resizeChangesPreview
    if (!value) {
      return
    }

    entriesRef.value = value
  }

  return {
    resizeChangesPreview,
    rangeModel,
    saveChanges,
  }
}
