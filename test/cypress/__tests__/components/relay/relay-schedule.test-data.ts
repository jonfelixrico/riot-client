import { PresentationScheduleEntry } from 'src/components/relay/relay-schedule-presentation.utils'
import { scheduleFromTimeString } from './relay-schedule.test-utils'

export const PRESENTATION_SCHEDULE_ENTRY_ARR: PresentationScheduleEntry[] = [
  scheduleFromTimeString('00:00:00', '11:00:00', 'ON'),
  scheduleFromTimeString('11:00:01', '12:59:59'),
  scheduleFromTimeString('13:00:00', '23:59:59', 'OFF'),
]
