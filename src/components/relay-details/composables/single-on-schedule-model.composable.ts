import { computed, ref } from 'vue'
import { PresentationScheduleEntry } from 'components/relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from 'components/relay/relay.constants'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

export function useSingleOnScheduleModel() {
  const start = ref<string | null>(null)
  const end = ref<string | null>(null)

  const schedule = computed(() => {
    if (!start.value || !end.value) {
      return null
    }

    const startSeconds = timeStringToSeconds(start.value)
    const endSeconds = timeStringToSeconds(end.value)

    const schedules: PresentationScheduleEntry[] = []

    if (startSeconds !== 0) {
      schedules.push({
        start: 0,
        end: startSeconds - 1,
        state: 'OFF',
      })
    }

    schedules.push({
      start: startSeconds,
      end: endSeconds,
      state: 'ON',
    })

    if (endSeconds !== MAX_SECONDS) {
      schedules.push({
        start: endSeconds + 1,
        end: MAX_SECONDS,
        state: 'OFF',
      })
    }

    return schedules
  })

  return {
    start,
    end,
    schedule,
  }
}
