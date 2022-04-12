import { DisplaySchedule } from 'src/utils/daily-relay-schedule.utils'
import { TimeUnit } from 'src/utils/relay-schedule.utils'
import { RelayState } from 'types/relay-config.interface'
import { MAX_SECONDS } from './relay.constants'

/**
 * Basically the same as {@link DisplaySchedule}, but the state is nullable and
 * the `start` and `end` props are represented as seconds instead of {@link TimeUnit}s.
 */
interface AugmentedDisplaySchedule {
  /** Seconds representation of {@link TimeUnit} */
  start: number

  /** Seconds representation of {@link TimeUnit} */
  end: number

  state: RelayState | null
}

/**
 * Converts {@link TimeUnit}s to seconds.
 * @param param0
 * @returns
 */
function timeUnitToSeconds({ hour, minute, second }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}

/**
 * Converts an array of {@link DisplaySchedule} into an array of {@link AugmentedDisplaySchedule}.
 *
 * @param param0
 * @returns
 */
export function convertDisplaySchedule({
  start,
  end,
  state,
}: DisplaySchedule): AugmentedDisplaySchedule {
  return {
    start: timeUnitToSeconds(start),
    end: timeUnitToSeconds(end),
    state,
  }
}

/**
 * Fills in the gaps between {@link AugmentedDisplaySchedule}s with null-state {@link AugmentedDisplaySchedule}s.
 *
 * @param items
 * @returns
 */
export function fillGapsInSchedule(
  items: AugmentedDisplaySchedule[]
): AugmentedDisplaySchedule[] {
  const filled: AugmentedDisplaySchedule[] = []

  let lastSeconds = 0
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (i === 0 && item.start !== 0) {
      filled.push({
        start: 0,
        end: item.start - 1,
        state: null,
      })
      filled.push(item)
    } else if (i === items.length - 1 && item.end !== MAX_SECONDS) {
      filled.push(item)
      filled.push({
        start: item.end + 1,
        end: MAX_SECONDS,
        state: null,
      })
    } else if (item.start !== lastSeconds + 1) {
      filled.push({
        start: lastSeconds,
        end: item.start - 1,
        state: null,
      })
      filled.push(item)
    }

    lastSeconds = item.end
  }

  return filled
}
