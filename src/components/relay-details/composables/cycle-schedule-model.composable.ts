import { computed, ref } from 'vue'
import { PresentationScheduleEntry } from 'components/relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from 'components/relay/relay.constants'

export type FirstState = 'ON' | 'Off'

export function useCycleScheduleModel() {
  // on and off represent seconds
  const on = ref<number | null>(null)
  const off = ref<number | null>(null)
  const firstState = ref<FirstState>('ON')

  const schedule = computed(() => {
    if (!on.value || !off.value) {
      return null
    }

    const schedule: PresentationScheduleEntry[] = []
    let state = firstState.value

    while (true) {
      const lastSchedule = schedule[schedule.length - 1]
      const stateValue = state === 'ON' ? on.value : off.value

      if (lastSchedule?.end === MAX_SECONDS) {
        // we have reached the full day cycle
        break
      } else if (!lastSchedule) {
        // first iteration
        schedule.push({
          state,
          start: 0,
          end: stateValue,
        })
      } else if (lastSchedule.end !== MAX_SECONDS) {
        // last iteration
        const start = lastSchedule.end + 1
        const end = Math.min(lastSchedule.end + stateValue, MAX_SECONDS)

        schedule.push({
          start,
          end,
          state,
        })
      }

      state = state === 'ON' ? 'OFF' : 'ON'
    }

    return schedule
  })

  return {
    on,
    off,
    firstState,
    schedule,
  }
}
