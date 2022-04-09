import { DateTime, Interval } from 'luxon'

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
  interval: Interval
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
function processInterval(
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
        interval: Interval.fromDateTimes(pStart, pStart.endOf('day')),
        state,
      },
      {
        interval: Interval.fromDateTimes(pEnd.startOf('day'), pEnd),
        state,
      },
    ]
  }

  return [
    {
      interval: Interval.fromDateTimes(pStart, pEnd),
      state,
    },
  ]
}
