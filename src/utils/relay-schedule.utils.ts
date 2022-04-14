import { clamp } from 'lodash'
import { DateTime } from 'luxon'
import {
  TimeUnit,
  RelayState,
  ScheduleEntry,
} from 'types/relay-config.interface'

/**
 * @deprecated We're not going to expose the involvement of DateTime in this API anymore.
 */
export interface ScheduleEntryWithDateTime extends ScheduleEntry {
  start: DateTime
  end: DateTime
  state: RelayState
}

export type TargetZone = Parameters<DateTime['setZone']>[0]

/**
 * Converts a time unit into a localized DateTime instance.
 * @param time
 * @param utcOffset
 * @param targetZone By default, the time unit gets localized into the system time. This allows
 * you to manually configure which timezone will the time unit get localized.
 * @returns The date portion of the DateTime returned will be the current date.
 */
function timeUnitToDateTime(
  time: TimeUnit,
  utcOffset: string,
  targetZone: TargetZone
): DateTime {
  return DateTime.now().setZone(`UTC${utcOffset}`).set(time).setZone(targetZone)
}

/**
 * Converts an array of entries/intervals to use Luxon's `Interval` class. Performs localization.
 * The start and end dates of intervals fall within the same day.
 *
 * If ever a raw interval ends up being localzied to have different-day start and end dates,
 * those will be split apart to their own intervals. E.g.
 *
 * If an interval ends up being localized as 2022-01-01T16:00:00 to 2022-01-02T02:00:00, it will
 * produce an interval of:
 * 2022-01-01T16:00:00 to 2022-01-01T23:59:59
 * 2022-01-02T00:00:00 to 2022-01-02T02:00:00
 *
 * @param param0
 * @param utcOffset
 * @param targetZone
 * @returns The date portion of the DateTimes will use the current (localized) Date.
 */
function transformScheduleEntry(
  { start, end, state }: ScheduleEntry,
  utcOffset: string,
  targetZone: TargetZone = 'local'
):
  | [ScheduleEntryWithDateTime, ScheduleEntryWithDateTime]
  | [ScheduleEntryWithDateTime] {
  const now = DateTime.now().setZone(targetZone)

  const pStart = timeUnitToDateTime(start, utcOffset, targetZone)
  const pEnd = timeUnitToDateTime(end, utcOffset, targetZone)

  if (!pStart.hasSame(now, 'day') || !pEnd.hasSame(now, 'day')) {
    return [
      {
        start: pStart.startOf('millisecond'),
        end: pStart.endOf('day'),
        state,
      },
      {
        start: pEnd.startOf('day'),
        end: pEnd.endOf('millisecond'),
        state,
      },
    ]
  }

  return [
    {
      start: pStart.startOf('millisecond'),
      end: pEnd.endOf('millisecond'),
      state,
    },
  ]
}

/**
 * Transform an array of {@link ScheduleEntry} objects into
 * {@link ScheduleEntryWithDateTime} objects.
 *
 * @param entries
 * @param utcOffset
 * @param targetZone
 * @returns
 */
export function transformAndLocalizeScheduleEntries(
  entries: ScheduleEntry[],
  utcOffset: string,
  targetZone: TargetZone = 'local'
): ScheduleEntryWithDateTime[] {
  const processedArr: ScheduleEntryWithDateTime[] = []

  for (const entry of entries) {
    processedArr.push(...transformScheduleEntry(entry, utcOffset, targetZone))
  }

  return processedArr
}

function isEligibleForMerge(
  a: ScheduleEntryWithDateTime,
  b: ScheduleEntryWithDateTime
) {
  return (
    // only same states are eligible for merging
    a.state === b.state &&
    /**
     * We don't want to end up mering something like...
     * 2022-01-01T20:00:00 - 2022-01-01T23:59:59
     * with
     * 2022-01-02T00:00:00 - 2022-01-02T02:00:00
     *
     * That just undoes our preprocessing in {@link processScheduleEntry}.
     */
    a.end.hasSame(b.start, 'day') &&
    /**
     * Must be literally in sequence to be eligible for merging.
     * This checking is also the reason why {@link processScheduleEntry} uses
     * startOf/endOf at the milliseconds level -- to make this checking consistent.
     */
    a.end.diff(b.start, 'millisecond').milliseconds <= 1
  )
}

function mergeEntries(
  a: ScheduleEntryWithDateTime,
  b: ScheduleEntryWithDateTime
): ScheduleEntryWithDateTime {
  return {
    state: a.state,
    start: a.start,
    end: b.end,
  }
}

/**
 * Merges successive schedules.
 * @param entries
 * @returns
 */
function mergeEligibleEntries(entries: ScheduleEntryWithDateTime[]) {
  const processedArr: ScheduleEntryWithDateTime[] = []

  for (const entry of entries) {
    const lastProcessed = processedArr[processedArr.length - 1]

    if (!lastProcessed || !isEligibleForMerge(lastProcessed, entry)) {
      processedArr.push(entry)
      continue
    }

    processedArr.push(mergeEntries(lastProcessed, entry))
  }

  return processedArr
}

/**
 * @deprecated It's problematic to expose the DateTime context.
 * @param entries
 * @param utcOffset
 * @param targetZone
 * @returns
 */
export function processScheduleEntries(
  entries: ScheduleEntry[],
  utcOffset: string,
  targetZone: TargetZone = 'local'
): ScheduleEntryWithDateTime[] {
  const transformedAndLocalized = transformAndLocalizeScheduleEntries(
    entries,
    utcOffset,
    targetZone
  )

  return mergeEligibleEntries(transformedAndLocalized)
}

type DayOffset = -1 | 0 | 1

export interface LocalizedScheduleEntry extends ScheduleEntry {
  dayOffset: DayOffset
}

function dateTimeToTimeUnit({ hour, minute, second }: DateTime): TimeUnit {
  return {
    hour,
    minute,
    second,
  }
}

function transformScheduleEntryWithDateTime(
  { start, end, state }: ScheduleEntryWithDateTime,
  referenceDay: DateTime['day']
): LocalizedScheduleEntry {
  return {
    dayOffset: clamp(start.day - referenceDay, -1, 1) as DayOffset,
    start: dateTimeToTimeUnit(start),
    end: dateTimeToTimeUnit(end),
    state,
  }
}

export function processScheduleEntriesV2(
  entries: ScheduleEntry[],
  utcOffset: string,
  targetZone: TargetZone = 'local'
): LocalizedScheduleEntry[] {
  const transformedAndLocalized = transformAndLocalizeScheduleEntries(
    entries,
    utcOffset,
    targetZone
  )

  const merged = mergeEligibleEntries(transformedAndLocalized)

  const localizedNow = DateTime.now().setZone(targetZone)

  return merged.map((entry) =>
    transformScheduleEntryWithDateTime(entry, localizedNow.day)
  )
}
