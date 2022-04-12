import {
  RawDailySchedule,
  DailyScheduleDisplayApi,
} from 'utils/daily-relay-schedule.utils'
import { computed } from 'vue'
import {
  convertDisplaySchedule,
  fillGapsInSchedule,
} from './schedule-presentation.utils'

export function useDailyScheduleComposable(props: RawDailySchedule) {
  const classInstance = computed(() =>
    DailyScheduleDisplayApi.fromDailySchedule(props)
  )

  const scheduleEntries = computed(() => {
    const { schedule } = classInstance.value
    const augmented = schedule.map(convertDisplaySchedule)
    return fillGapsInSchedule(augmented)
  })

  return {
    scheduleEntries,
  }
}
