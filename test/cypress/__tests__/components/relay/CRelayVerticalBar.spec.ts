import { RelayState } from 'src/utils/relay-schedule.utils'
import {
  DisplaySchedule,
  ExtendedTimeUnit,
} from 'utils/daily-relay-schedule.utils'
import { mount } from '@cypress/vue'
import CRelayVerticalBar from 'components/relay/CRelayVerticalBar.vue'

function timeUnitHelper(timeStr: string): ExtendedTimeUnit {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return {
    hour,
    minute,
    second,
    millis: (hour * 3600 + minute * 60 + second) * 1000,
  }
}

function scheduleHelper(
  startStr: string,
  endStr: string,
  state: RelayState
): DisplaySchedule {
  return {
    start: timeUnitHelper(startStr),
    end: timeUnitHelper(endStr),
    state,
  }
}

describe('CRelayVerticalBar', () => {
  it('should contain value', () => {
    const sched: DisplaySchedule[] = [
      scheduleHelper('00:00:00', '12:00:00', 'ON'),
      scheduleHelper('00:00:00', '12:00:01', 'OFF'),
    ]

    mount(CRelayVerticalBar, {})
  })
})
