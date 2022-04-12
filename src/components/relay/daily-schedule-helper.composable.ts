import { RelayState, TimeUnit } from 'src/utils/relay-schedule.utils'
import {
  RawDailySchedule,
  DailyScheduleDisplayApi,
  DisplaySchedule,
} from 'utils/daily-relay-schedule.utils'
import { computed } from 'vue'
import { MAX_SECONDS } from './relay.constants'

interface AugmentedDisplaySchedule {
  start: number
  end: number
  state: RelayState | null
}

function timeUnitToSeconds({ hour, minute, second }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}

function convertDisplaySchedule({
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

function fillEmptySections(
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

export function useDailyScheduleComposable(props: RawDailySchedule) {
  const classInstance = computed(() =>
    DailyScheduleDisplayApi.fromDailySchedule(props)
  )

  const scheduleEntries = computed(() => {
    const { schedule } = classInstance.value
    const augmented = schedule.map(convertDisplaySchedule)
    return fillEmptySections(augmented)
  })

  return {
    scheduleEntries,
  }
}
