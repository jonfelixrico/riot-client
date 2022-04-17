import { PresentationScheduleEntry } from 'src/components/relay/relay-schedule-presentation.utils'
import {
  RelayState,
  ScheduleEntry,
  TimeUnit,
} from 'src/types/relay-config.interface'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

export function timeStringToPresentationScheduleEntry(
  startStr: string,
  endStr: string,
  state: RelayState
): PresentationScheduleEntry {
  return {
    start: timeStringToSeconds(startStr),
    end: timeStringToSeconds(endStr),
    state,
  }
}

function timeStringToTimeUnit(timeStr: string): TimeUnit {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return {
    hour,
    minute,
    second,
  }
}

export function timeStringToScheduleEntry(
  startStr: string,
  endStr: string,
  state: RelayState
): ScheduleEntry {
  return {
    start: timeStringToTimeUnit(startStr),
    end: timeStringToTimeUnit(endStr),
    state: state,
  }
}
