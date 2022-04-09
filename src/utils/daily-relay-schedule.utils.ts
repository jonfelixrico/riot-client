import { sortBy } from 'lodash'
import { DateTime } from 'luxon'
import {
  mergeEligibleEntries,
  ProcessedRelayScheduleEntry,
  processScheduleEntryArray,
  RawRelayScheduleEntry,
  RelayState,
  TargetZone,
  TimeUnit,
} from './relay-schedule.utils'

interface RawDailySchedule {
  utcOffset: string
  dailySchedule: RawRelayScheduleEntry[]
}

/**
 * Adds a `millis` attribute to the {@link TimeUnit} interface.
 */
interface ExtendedTimeUnit extends TimeUnit {
  /**
   * It should be noted that this millis is different from DateTime's millis.
   * This is pretty much just hours in millis + minutes in millis + seconds in millis.
   * This does not care about zones.
   */
  millis: number
}
interface DisplaySchedule {
  start: ExtendedTimeUnit
  end: ExtendedTimeUnit
  state: RelayState
}

interface IDailyScheduleDisplayApi {
  schedule: DisplaySchedule[]
  getState(referenceDt?: DateTime): RelayState | null
}

interface DailyScheduleDisplayApiOptions {
  targetZone?: TargetZone
}

function dateTimeToTimeUnit({
  hour,
  minute,
  second,
}: DateTime): ExtendedTimeUnit {
  return {
    hour,
    minute,
    second,
    millis: (hour * 3600 + minute * 60 + second) * 1000,
  }
}

/**
 * Maps all {@link DateTime}s with {@link dateTimeToTimeUnit}. Additonally,
 * they get sorted by their start times.
 *
 * @param entries
 * @returns
 */
function dateTimeArrayToTimeUnitArray(
  entries: ProcessedRelayScheduleEntry[]
): DisplaySchedule[] {
  const mapped = entries.map(({ interval: { start, end }, state }) => {
    return {
      state,
      start: dateTimeToTimeUnit(start),
      end: dateTimeToTimeUnit(end),
    }
  })

  return sortBy(mapped, 'start.$millis')
}

export class DailyScheduleDisplayApi implements IDailyScheduleDisplayApi {
  static fromDailySchedule(
    raw: RawDailySchedule,
    options?: DailyScheduleDisplayApiOptions
  ) {
    return new DailyScheduleDisplayApi(raw, options)
  }

  private entries: ProcessedRelayScheduleEntry[]

  /**
   * We have a version with the "_" prefix for encapsulation.
   */
  private _schedule: DisplaySchedule[]
  private targetZone: TargetZone

  private constructor(
    { dailySchedule, utcOffset }: RawDailySchedule,
    options?: DailyScheduleDisplayApiOptions
  ) {
    const targetZone = (this.targetZone = options?.targetZone ?? 'local')

    this.entries = mergeEligibleEntries(
      processScheduleEntryArray(dailySchedule, utcOffset, targetZone)
    )

    this._schedule = dateTimeArrayToTimeUnitArray(this.entries)
  }

  get schedule(): DisplaySchedule[] {
    return this._schedule
  }

  getState(referenceDt: DateTime) {
    referenceDt ?? DateTime.now()

    const converted = referenceDt.setZone(this.targetZone)
    const { millis } = dateTimeToTimeUnit(converted)

    const currentInterval = this._schedule.find(
      ({ start, end }) => millis >= start.millis && millis <= end.millis
    )

    return currentInterval?.state ?? null
  }
}
