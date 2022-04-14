import { PresentationScheduleEntry } from 'src/components/relay/relay-schedule-presentation.utils'
import { timeStringToPresentationScheduleEntry } from './relay-schedule.test-utils'

export const SINGLE_DAY_SCHEDULE: PresentationScheduleEntry[] = [
  timeStringToPresentationScheduleEntry('00:00:00', '11:00:00', 'ON'),
  timeStringToPresentationScheduleEntry('11:00:01', '12:59:59'),
  timeStringToPresentationScheduleEntry('13:00:00', '23:59:59', 'OFF'),
]
