import { RelayState } from 'src/utils/relay-schedule.utils'

export interface ScheduleBarItem {
  start: number
  end: number
  id: string
  state: RelayState | number
}
