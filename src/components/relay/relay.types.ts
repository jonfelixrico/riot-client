import { WeeklySchedule } from 'src/types/relay-config.interface'
import { ScheduleEntryWithDateTime } from 'src/utils/relay-schedule.utils'

/**
 * Necessary because TS doesn't allow us to extend WeeklySchedule[prop] directly
 */
type WeeklyScheduleObj = WeeklySchedule['weeklySchedule']

/**
 * WeeklySchedule.weeklySchedule but with a "richer" array data type.
 */
export interface ExtendedWeeklySchedule extends WeeklyScheduleObj {
  sun: ScheduleEntryWithDateTime[]
  mon: ScheduleEntryWithDateTime[]
  tues: ScheduleEntryWithDateTime[]
  wed: ScheduleEntryWithDateTime[]
  thurs: ScheduleEntryWithDateTime[]
  fri: ScheduleEntryWithDateTime[]
  sat: ScheduleEntryWithDateTime[]
}
