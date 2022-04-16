import { uid } from 'quasar'
import { Ref } from 'vue'
import { ScheduleEntryForEditing } from './relay-edit.types'

export function useScheduleEntryAddHandler(
  entriesRef: Ref<ScheduleEntryForEditing[]>,
  activeIdRef: Ref<string | null>
) {
  /**
   * Appends a schedule entry to the active entry.
   * @returns
   */
  function addEntry() {
    const { value: activeId } = activeIdRef
    if (!activeId) {
      console.warn(
        'scheduleEntryAddHandler: addEntry was called even if there are no active entries'
      )
      return
    }

    const { value: entries } = entriesRef
    const activeIdx = entries.findIndex(({ id }) => activeId === id)

    const activeEntry = entries[activeIdx]
    const duration = activeEntry.end - activeEntry.start
    const midpoint =
      duration % 2 === 0 ? duration / 2 : Math.floor(duration / 2)
    const replacements: ScheduleEntryForEditing[] = [
      {
        ...entries[activeIdx],
        end: midpoint,
      },
      {
        start: midpoint + 1,
        end: activeEntry.end,
        state: activeEntry.state === 'ON' ? 'OFF' : 'ON',
        id: uid(),
      },
    ]

    entries.splice(activeIdx, 1, ...replacements)
  }

  return {
    addEntry,
  }
}
