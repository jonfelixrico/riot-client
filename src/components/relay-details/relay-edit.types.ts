import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'

export interface ScheduleEntryForEditing extends PresentationScheduleEntry {
  /**
   * Just an internal id for editing-related components. It helps us differentiate
   * items better than just relying on indexes.
   */
  id: string
}
