import { cloneDeep } from 'lodash'
import { uid } from 'quasar'
import { computed, Ref } from 'vue'
import { MAX_SECONDS } from '../relay/relay.constants'
import { ScheduleEntryForEditing } from './relay-edit.types'

export function useScheduleEntryDeleteHandler(
  entriesRef: Ref<ScheduleEntryForEditing[]>,
  selectedIdRef: Ref<string | null>
) {
  const selectedIdxRef = computed(() => {
    const { value: selectedId } = selectedIdRef

    if (!selectedId) {
      return null
    }

    return entriesRef.value.findIndex(({ id }) => selectedId === id)
  })

  function handleDelete() {
    const { value: entries } = entriesRef
    const { value: index } = selectedIdxRef

    if (index === null) {
      console.warn(
        'scheduleEntryDeleteHandler: handleDelete was called even if there are no selected entries'
      )
      return
    }

    if (entries.length === 1) {
      entriesRef.value = [
        {
          start: 0,
          end: MAX_SECONDS,
          state: 'OFF',
          id: uid(),
        },
      ]
    } else if (index !== entries.length - 1) {
      // handling for index 0 to 2nd to the last item
      const clone = cloneDeep(entries)

      const toDelete = clone[index]
      const toTakeOver = clone[index + 1]

      /*
       * The item to the right will "occupy" the space that the entry to be
       * deleted was occupying.
       */
      toTakeOver.start = toDelete.start
      clone.splice(index, 1)

      entriesRef.value = clone
    } else if (index === entries.length - 1) {
      /*
       * This is the handling for the last item. The difference here is that the item
       * to the left will take over instead of the item to the right.
       */

      const clone = cloneDeep(entries)

      /*
       * The item to the left will "occupy" the space that the entry to be
       * deleted was occupying.
       */
      const toDelete = clone[index]
      const toTakeOver = clone[index - 1]

      toTakeOver.start = toDelete.start
      clone.splice(index, -1)

      entriesRef.value = clone
    }
  }

  return {
    handleDelete,
  }
}
