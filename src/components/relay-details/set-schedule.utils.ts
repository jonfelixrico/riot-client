import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import { MAX_SECONDS } from '../relay/relay.constants'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

export function convertSingleOnScheduleToScheduleArray(
  startString: string,
  endString: string
) {
  if (!startString || !endString) {
    return
  }

  const startSeconds = timeStringToSeconds(startString)
  const endSeconds = timeStringToSeconds(endString)

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
}
