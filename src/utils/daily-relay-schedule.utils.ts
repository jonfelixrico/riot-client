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

interface DisplaySchedule {
  start: TimeUnit
  end: TimeUnit
  state: RelayState
}

interface IDailyScheduleDisplayApi {
  schedule: DisplaySchedule[]
  state: RelayState | null
}

interface DailyScheduleDisplayApiOptions {
  targetZone?: TargetZone
}

/**
 * Internal representation of the TimeUnit interface.
 * We're slapping in some properties to help with operations.
 */
interface InternalTimeUnit extends TimeUnit {
  /**
   * It should be noted that this millis is different from DateTime's millis.
   * This is pretty much just hours in millis + minutes in millis + seconds in millis.
   *
   * TBH we could go for seconds, but eh. This feels "closer" to the DateTime API.
   */
  $millis: number
}

interface InternalDisplaySchedule extends DisplaySchedule {
  start: InternalTimeUnit
  end: InternalTimeUnit
}

function dateTimeToTimeUnit({
  hour,
  minute,
  second,
}: DateTime): InternalTimeUnit {
  return {
    hour,
    minute,
    second,
    $millis: (hour * 3600 + minute * 60 + second) * 1000,
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
): InternalDisplaySchedule[] {
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
  private entries: ProcessedRelayScheduleEntry[]
  private timeUnits: InternalDisplaySchedule[]
  private targetZone: TargetZone

  constructor(
    { dailySchedule, utcOffset }: RawDailySchedule,
    options?: DailyScheduleDisplayApiOptions
  ) {
    const targetZone = (this.targetZone = options?.targetZone ?? 'local')

    this.entries = mergeEligibleEntries(
      processScheduleEntryArray(dailySchedule, utcOffset, targetZone)
    )

    this.timeUnits = dateTimeArrayToTimeUnitArray(this.entries)
  }

  get schedule(): DisplaySchedule[] {
    return this.timeUnits
  }

  private get nowMillis() {
    const now = DateTime.now().setZone(this.targetZone)
    return dateTimeToTimeUnit(now).$millis
  }

  get state(): RelayState | null {
    const { nowMillis } = this
    const currentInterval = this.timeUnits.find(
      ({ start, end }) => nowMillis >= start.$millis && nowMillis <= end.$millis
    )

    return currentInterval?.state ?? null
  }
}
