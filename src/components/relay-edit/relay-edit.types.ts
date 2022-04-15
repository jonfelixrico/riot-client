import { ScheduleEntry } from 'src/types/relay-config.interface'

export interface ScheduleEntryForEditing extends ScheduleEntry {
  /**
   * Just an internal id for editing-related components. It helps us differentiate
   * items better than just relying on indexes.
   */
  id: string
}
