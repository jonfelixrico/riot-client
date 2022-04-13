import { DateTime } from 'luxon'
import { RelayState } from 'src/types/relay-config.interface'
import { ScheduleEntryWithDateTime } from 'src/utils/relay-schedule.utils'

/**
 * Converts a {@link DateTime} object into a number representing
 * its hours + minutes + seconds as seconds.
 * @param param0
 * @returns
 */
function convertDateTimeToSeconds({ hour, minute, second }: DateTime): number {
  return hour * 3600 + minute * 60 + second
}

export interface ScheduleEntryWithSeconds {
  state: RelayState
  start: number
  end: number
}

export function transformToScheduleEntryWithSeconds(
  entries: ScheduleEntryWithDateTime[]
): ScheduleEntryWithSeconds[] {
  return entries.map(({ start, end, state }) => {
    return {
      start: convertDateTimeToSeconds(start),
      end: convertDateTimeToSeconds(end),
      state,
    }
  })
}
