import { omit } from 'lodash'
import { computed, ref } from 'vue'
import { useCycleScheduleModel } from './cycle-schedule-model.composable'
import { useSingleOnScheduleModel } from './single-on-schedule-model.composable'

export function useScheduleModel() {
  const cycle = useCycleScheduleModel()
  const singleOn = useSingleOnScheduleModel()
  const mode = ref<'CYCLE' | 'SINGLE_ON'>('CYCLE')

  const schedule = computed(() => {
    if (mode.value === 'CYCLE') {
      return cycle.schedule.value
    } else {
      return singleOn.schedule.value
    }
  })

  return {
    cycle: omit(cycle, 'schedule'),
    singleOn: omit(singleOn, 'schedule'),
    mode,
    schedule,
  }
}
