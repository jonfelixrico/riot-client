import { computed, ref } from 'vue'
import { PresentationScheduleEntry } from 'components/relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from 'components/relay/relay.constants'

export function useCycleScheduleModel() {
  // on and off represent seconds
  const on = ref<number | null>(null)
  const off = ref<number | null>(null)
  const firstState = ref<'ON' | 'OFF'>('ON')

  const schedule = computed(() => {
    if (!on.value || !off.value) {
      return null
    }

    const schedule: PresentationScheduleEntry[] = []

    let state = firstState.value
    while (true) {
      const lastSchedule = schedule[schedule.length - 1]
      if (lastSchedule?.end === MAX_SECONDS) {
        break
      } else if (!lastSchedule) {
        schedule.push({
          state,
          start: 0,
          end: state === 'ON' ? on.value : off.value,
        })

        state = state === 'ON' ? 'OFF' : 'ON'
      } else if (lastSchedule.end !== MAX_SECONDS) {
        const start = lastSchedule.end + 1
        const end = Math.min(
          start + (state === 'ON' ? on.value : off.value),
          MAX_SECONDS
        )

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
