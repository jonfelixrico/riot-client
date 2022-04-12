import { RelayState } from 'src/utils/relay-schedule.utils'

export interface ScheduleBarItem {
  /**
   * Time unit represented as seconds.
   */
  start: number

  /**
   * Time unit represented as seconds.
   */
  end: number

  id: string

  /**
   * A state of null means that the scheduel item is unoccupied.
   */
  state: RelayState | null
}
