import { DateTime } from 'luxon'
import { RelayState } from 'src/types/relay-config.interface'
import { ScheduleEntryWithDateTime } from 'src/utils/relay-schedule.utils'
import { MAX_SECONDS } from './relay.constants'

/**
 * Converts a {@link DateTime} object into a number representing
 * its hours + minutes + seconds as seconds.
 * @param param0
 * @returns
 */
export function convertDateTimeToSeconds({
  hour,
  minute,
  second,
}: DateTime): number {
  return hour * 3600 + minute * 60 + second
}

export interface PresentationScheduleEntry {
  state: RelayState | null
  start: number
  end: number
}

export function transformForPresentation(
  entries: ScheduleEntryWithDateTime[]
): PresentationScheduleEntry[] {
  return entries.map(({ start, end, state }) => {
    return {
      start: convertDateTimeToSeconds(start),
      end: convertDateTimeToSeconds(end),
      state,
    }
  })
}

/**
 * Fills in the gaps between {@link PresentationScheduleEntry}s with null-state {@link PresentationScheduleEntry}s.
 *
 * @param items
 * @returns
 */
export function fillGapsInSchedule(
  items: PresentationScheduleEntry[]
): PresentationScheduleEntry[] {
  const filled: PresentationScheduleEntry[] = []

  let lastSeconds = 0
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (i === 0 && item.start !== 0) {
      // first sched doesnt start at schedule-0
      filled.push({
        start: 0,
        end: item.start - 1,
        state: null,
      })
      filled.push(item)
    } else if (i === items.length - 1 && item.end < MAX_SECONDS) {
      // last sched doesn't end at the final second
      filled.push(item)
      filled.push({
        start: item.end + 1,
        end: MAX_SECONDS,
        state: null,
      })
    } else if (lastSeconds !== 0 && item.start < lastSeconds + 1) {
      filled.push({
        start: lastSeconds + 1,
        end: item.start - 1,
        state: null,
      })
      filled.push(item)
    } else {
      filled.push(item)
    }

    lastSeconds = item.end
  }

  return filled
}
