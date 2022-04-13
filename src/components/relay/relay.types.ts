import { RelayState } from 'src/types/relay-config.interface'

export interface ScheduleBarItem {
  /**
   * Time unit represented as seconds.
   */
  start: number

  /**
   * Time unit represented as seconds.
   */
  end: number

  /**
   * A state of null means that the scheduel item is unoccupied.
   */
  state: RelayState | null
}
