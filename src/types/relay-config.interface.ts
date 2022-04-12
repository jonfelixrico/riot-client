import { TimeUnit } from 'src/utils/relay-schedule.utils'

export type RelayState = 'ON' | 'OFF'

export interface BaseSchedule {
  utcOffset: string
  type: 'DAILY' | 'WEEKLY'
}

export interface ScheduleEntry {
  start: TimeUnit

  end: TimeUnit
  state: RelayState
}

/**
 * Schedule in a daily cycle.
 */
export interface DailySchedule extends BaseSchedule {
  type: 'DAILY'
  dailySchedule: ScheduleEntry[]
}

/**
 * Schedule in a weekly cycle.
 */
export interface WeeklySchedule extends BaseSchedule {
  type: 'WEEKLY'
  weeklySchedule: {
    sun: ScheduleEntry[]
    mon: ScheduleEntry[]
    tues: ScheduleEntry[]
    wed: ScheduleEntry[]
    thurs: ScheduleEntry[]
    fri: ScheduleEntry[]
    sat: ScheduleEntry[]
  }
}

export interface Override {
  state: RelayState
  overrideUntil?: Date
}

type Schedule = DailySchedule | WeeklySchedule

export interface RelayConfig {
  schedule: Schedule

  /**
   * If not null, then that means that the switch's schedule is being overridden.
   */
  override?: Override
}
