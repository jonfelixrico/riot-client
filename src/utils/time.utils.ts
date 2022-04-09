interface TimeUnit {
  hour: number
  minute: number
  second: number
}

interface TimeUnitWithOffset extends TimeUnit {
  offset: number
}

const DAY_MIN = 0
const DAY_MAX = 60 * 60 * 24

function secondsToTimeUnit(seconds: number): TimeUnit {
  const localHours = Math.floor(seconds / 3600) // get whole hours
  const localMinutes = Math.floor((seconds - localHours * 3600) / 60) // get remaining whole minutes
  const localSeconds = seconds - (localHours * 3600 + localMinutes * 60)

  return {
    hour: localHours,
    minute: localMinutes,
    second: localSeconds,
  }
}

function applyOffset(
  input: TimeUnit,
  minuteOffset: number
): { time: TimeUnit; dayOffset: -1 | 0 | 1 } {
  const { hour, minute, second } = input

  const toSeconds = (minute + hour * 60) * 60 + second
  const offsetAsSeconds = minuteOffset * 60

  const offsetApplied = toSeconds + offsetAsSeconds

  if (offsetApplied < DAY_MIN) {
    return {
      time: secondsToTimeUnit(DAY_MAX - Math.abs(offsetApplied)),
      dayOffset: -1,
    }
  } else if (offsetApplied > DAY_MAX) {
    return {
      time: secondsToTimeUnit(DAY_MIN + (offsetApplied - DAY_MAX)),
      dayOffset: 1,
    }
  }

  return {
    time: secondsToTimeUnit(offsetApplied),
    dayOffset: 0,
  }
}

interface ConversionResults {
  time: TimeUnit
  oldOffset: number
  offset: number
  dayOffset: number
}

export function convertOffset(
  input: TimeUnitWithOffset,
  minuteOffset: number
): ConversionResults {
  const { offset: inputOffset, ...timeData } = input

  const { time, dayOffset } = applyOffset(
    timeData,
    // negate the input offset to represent setting the offset back to 0, then add our actual offset
    minuteOffset - inputOffset
  )

  return {
    time,
    oldOffset: inputOffset,
    offset: minuteOffset,
    dayOffset,
  }
}
