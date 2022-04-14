import { mapValues, sortBy } from 'lodash'
import { WeeklySchedule } from 'src/types/relay-config.interface'
import {
  LocalizedScheduleEntry,
  localizeScheduleEntries,
} from 'src/utils/relay-schedule.utils'
import { representTimeUnitAsSeconds } from './relay-schedule-presentation.utils'

export type DayOfWeekString = keyof WeeklySchedule['weeklySchedule']

const DOW_SEQUENCE: DayOfWeekString[] = [
  'mon',
  'tues',
  'wed',
  'thurs',
  'fri',
  'sat',
  'sun',
]

function findSpilloverDestination(
  sourceDay: DayOfWeekString,
  offset: LocalizedScheduleEntry['dayOffset']
): DayOfWeekString {
  const index = DOW_SEQUENCE.findIndex((dowString) => dowString === sourceDay)
  const offsetApplied = index + offset

  if (offsetApplied < 0) {
    return 'mon'
  } else if (offsetApplied > 7) {
    return 'sun'
  } else {
    return DOW_SEQUENCE[offsetApplied]
  }
}

type LocalizedWeeklySchedule = Record<DayOfWeekString, LocalizedScheduleEntry[]>
type ActualWeeklySchedule = WeeklySchedule['weeklySchedule']

function transferSpillovers(
  weeklySched: LocalizedWeeklySchedule
): ActualWeeklySchedule {
  const results: ActualWeeklySchedule = {
    mon: [],
    tues: [],
    wed: [],
    thurs: [],
    fri: [],
    sat: [],
    sun: [],
  }

  for (const key in weeklySched) {
    const dowString = key as DayOfWeekString
    const singleDaySched = weeklySched[dowString]
    for (const { dayOffset, ...otherData } of singleDaySched) {
      const destDay = findSpilloverDestination(dowString, dayOffset)
      results[destDay].push(otherData)
    }
  }

  return mapValues(results, (value) => {
    return sortBy(value, ({ start }) => representTimeUnitAsSeconds(start))
  })
}

export function localizeWeeklySchedule(
  { utcOffset, weeklySchedule }: Omit<WeeklySchedule, 'type'>,
  targetZone: string
): ActualWeeklySchedule {
  const localizedWeeklySchedule = mapValues(weeklySchedule, (sched) =>
    localizeScheduleEntries(sched, utcOffset, targetZone)
  )

  return transferSpillovers(localizedWeeklySchedule)
}
