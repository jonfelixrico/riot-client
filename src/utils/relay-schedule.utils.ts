import { DateTime } from 'luxon'

interface TimeUnit {
  hour: number
  minute: number
  second: number
}

type RelayState = 'ON' | 'OFF'

interface RawRelayScheduleEntry {
  start: TimeUnit
  end: TimeUnit
  state: RelayState
}

interface ProcessedRelayScheduleEntry {
  interval: {
    start: DateTime
    end: DateTime
  }
  state: RelayState
}

type TargetZone = Parameters<DateTime['setZone']>[0]

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

export function processScheduleEntryArray(
  entries: RawRelayScheduleEntry[],
  utcOffset: string,
  targetZone: TargetZone = 'local'
) {
  const processedArr: ProcessedRelayScheduleEntry[] = []

  for (const entry of entries) {
    const processed = processScheduleEntry(entry, utcOffset, targetZone)
    const lastProcessed = processedArr[processedArr.length - 1]

    if (!lastProcessed) {
      processedArr.push(...processed)
      continue
    }

    /*
     * We don't care about the possible 2nd item since
     * that will be on a different date -- it automatically fails the second
     * condition below.
     */
    const firstItem = processed[0]

    if (
      // only same states are eligible for merging
      lastProcessed.state !== firstItem.state ||
      /**
       * We don't want to end up mering something like...
       * 2022-01-01T20:00:00 - 2022-01-01T23:59:59
       * with
       * 2022-01-02T00:00:00 - 2022-01-02T02:00:00
       *
       * That just undoes our preprocessing in {@link processScheduleEntry}.
       */
      !lastProcessed.interval.end.hasSame(firstItem.interval.start, 'day') ||
      /**
       * Must be literally in sequence to be eligible for merging.
       * This checking is also the reason why {@link processScheduleEntry} uses
       * startOf/endOf at the milliseconds level -- to make this checking consistent.
       */
      lastProcessed.interval.end.diff(firstItem.interval.start, 'millisecond')
        .milliseconds > 1
    ) {
      const merged: ProcessedRelayScheduleEntry = {
        state: lastProcessed.state,
        interval: {
          start: lastProcessed.interval.start,
          end: firstItem.interval.end,
        },
      }

      processedArr.push(merged)
    }
  }

  return processedArr
}
