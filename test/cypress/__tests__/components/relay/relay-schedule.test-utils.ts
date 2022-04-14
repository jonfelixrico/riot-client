import { PresentationScheduleEntry } from 'src/components/relay/relay-schedule-presentation.utils'
import { RelayState } from 'src/types/relay-config.interface'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

export function scheduleFromTimeString(
  startStr: string,
  endStr: string,
  state?: RelayState
): PresentationScheduleEntry {
  return {
    start: timeStringToSeconds(startStr),
    end: timeStringToSeconds(endStr),
    state: state ?? null,
  }
}
