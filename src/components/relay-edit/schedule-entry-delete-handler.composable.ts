import { cloneDeep } from 'lodash'
import { uid } from 'quasar'
import { ScheduleEntry } from 'types/relay-config.interface'
import { Ref } from 'vue'
import { ScheduleEntryForEditing } from './relay-edit.types'

export function useScheduleEntryDeleteHandler(
  toMutate: Ref<ScheduleEntryForEditing[]>
) {
  function handleDelete(toDeleteId: string) {
    const { value } = toMutate
    const index = toMutate.value.findIndex(({ id }) => id === toDeleteId)

    if (value.length === 1) {
      toMutate.value = [
        {
          start: {
            hour: 0,
            minute: 0,
            second: 0,
          },
          end: {
            hour: 23,
            minute: 59,
            second: 59,
          },
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

      toMutate.value = clone
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

      toMutate.value = clone
    }
  }

  return {
    handleDelete,
  }
}
