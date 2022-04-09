import { DateTime } from 'luxon'

export interface TimeUnit {
  hour: number
  minute: number
  second: number
}

export type RelayState = 'ON' | 'OFF'

export interface RawRelayScheduleEntry {
  start: TimeUnit
  end: TimeUnit
  state: RelayState
}

export interface ProcessedRelayScheduleEntry {
  interval: {
    start: DateTime
    end: DateTime
  }
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
function processTimeUnit(
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
function processScheduleEntry(
  { start, end, state }: RawRelayScheduleEntry,
  utcOffset: string,
  targetZone: TargetZone = 'local'
):
  | [ProcessedRelayScheduleEntry, ProcessedRelayScheduleEntry]
  | [ProcessedRelayScheduleEntry] {
  const now = DateTime.now().setZone(targetZone)

  const pStart = processTimeUnit(start, utcOffset, targetZone)
  const pEnd = processTimeUnit(end, utcOffset, targetZone)

  if (!pStart.hasSame(now, 'day') || !pEnd.hasSame(now, 'day')) {
    return [
      {
        interval: {
          start: pStart.startOf('millisecond'),
          end: pStart.endOf('day'),
        },
        state,
      },
      {
        interval: {
          start: pEnd.startOf('day'),
          end: pEnd.endOf('millisecond'),
        },
        state,
      },
    ]
  }

  return [
    {
      interval: {
        start: pStart.startOf('millisecond'),
        end: pEnd.endOf('millisecond'),
      },
      state,
    },
  ]
}

function isEligibleForMerge(
  a: ProcessedRelayScheduleEntry,
  b: ProcessedRelayScheduleEntry
) {
  return (
    // only same states are eligible for merging
    a.state !== b.state ||
    /**
     * We don't want to end up mering something like...
     * 2022-01-01T20:00:00 - 2022-01-01T23:59:59
     * with
     * 2022-01-02T00:00:00 - 2022-01-02T02:00:00
     *
     * That just undoes our preprocessing in {@link processScheduleEntry}.
     */
    !a.interval.end.hasSame(b.interval.start, 'day') ||
    /**
     * Must be literally in sequence to be eligible for merging.
     * This checking is also the reason why {@link processScheduleEntry} uses
     * startOf/endOf at the milliseconds level -- to make this checking consistent.
     */
    a.interval.end.diff(b.interval.start, 'millisecond').milliseconds <= 1
  )
}

function mergeEntries(
  a: ProcessedRelayScheduleEntry,
  b: ProcessedRelayScheduleEntry
): ProcessedRelayScheduleEntry {
  return {
    state: a.state,
    interval: {
      start: a.interval.start,
      end: b.interval.end,
    },
  }
}

export function processScheduleEntryArray(
  entries: RawRelayScheduleEntry[],
  utcOffset: string,
  targetZone: TargetZone = 'local'
): ProcessedRelayScheduleEntry[] {
  const processedArr: ProcessedRelayScheduleEntry[] = []

  for (const entry of entries) {
    processedArr.push(...processScheduleEntry(entry, utcOffset, targetZone))
  }

  return processedArr
}

export function mergeEligibleEntries(entries: ProcessedRelayScheduleEntry[]) {
  const processedArr: ProcessedRelayScheduleEntry[] = []

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
