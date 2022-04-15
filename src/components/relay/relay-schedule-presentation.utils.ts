import {
  RelayState,
  ScheduleEntry,
  TimeUnit,
} from 'src/types/relay-config.interface'
export interface PresentationScheduleEntry {
  state: RelayState
  start: number
  end: number
}

export function representTimeUnitAsSeconds({ hour, minute, second }: TimeUnit) {
  return hour * 3600 + minute * 60 + second
}

export function transformScheduleEntryForPresentation({
  start,
  end,
  state,
}: ScheduleEntry): PresentationScheduleEntry {
  return {
    state,
    start: representTimeUnitAsSeconds(start),
    end: representTimeUnitAsSeconds(end),
  }
}
