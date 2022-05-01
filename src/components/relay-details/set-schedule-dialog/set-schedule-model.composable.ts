import { omit } from 'lodash'
import { computed, reactive, ref } from 'vue'
import { useCycleScheduleModel } from './cycle-schedule-model.composable'
import { useSingleOnScheduleModel } from './single-on-schedule-model.composable'

export function useSetScheduleModel() {
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
    cycle: reactive(omit(cycle, 'schedule')),
    singleOn: reactive(omit(singleOn, 'schedule')),
    mode,
    schedule,
  }
}
