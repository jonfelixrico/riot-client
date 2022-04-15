import { cloneDeep } from 'lodash'
import { uid } from 'quasar'
import { Ref } from 'vue'
import { MAX_SECONDS } from '../relay/relay.constants'
import { ScheduleEntryForEditing } from './relay-edit.types'

export function useScheduleEntryDeleteHandler(
  entries: Ref<ScheduleEntryForEditing[]>
) {
  function handleDelete(toDeleteId: string) {
    const { value } = entries
    const index = entries.value.findIndex(({ id }) => id === toDeleteId)

    if (value.length === 1) {
      entries.value = [
        {
          start: 0,
          end: MAX_SECONDS,
          state: 'OFF',
          id: uid(),
        },
      ]
    } else if (index !== value.length - 1) {
      // handling for index 0 to 2nd to the last item
      const clone = cloneDeep(value)

      const toDelete = clone[index]
      const toTakeOver = clone[index + 1]

      /*
       * The item to the right will "occupy" the space that the entry to be
       * deleted was occupying.
       */
      toTakeOver.start = toDelete.start
      clone.splice(index, 1)

      entries.value = clone
    } else if (index === value.length - 1) {
      /*
       * This is the handling for the last item. The difference here is that the item
       * to the left will take over instead of the item to the right.
       */

      const clone = cloneDeep(value)

      /*
       * The item to the left will "occupy" the space that the entry to be
       * deleted was occupying.
       */
      const toDelete = clone[index]
      const toTakeOver = clone[index - 1]

      toTakeOver.start = toDelete.start
      clone.splice(index, -1)

      entries.value = clone
    }
  }

  return {
    handleDelete,
  }
}
