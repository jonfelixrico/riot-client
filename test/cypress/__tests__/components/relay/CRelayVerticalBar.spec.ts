import { RelayState, TimeUnit } from 'src/utils/relay-schedule.utils'
import { DisplaySchedule } from 'utils/daily-relay-schedule.utils'
import { mount } from '@cypress/vue'
import CRelayVerticalBar from 'components/relay/CRelayVerticalBar.vue'

function timeUnitHelper(timeStr: string): TimeUnit {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return {
    hour,
    minute,
    second,
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
  it('should display interval details', () => {
    const schedule: DisplaySchedule[] = [
      scheduleHelper('00:00:00', '11:00:00', 'ON'),
      scheduleHelper('13:00:00', '23:59:59', 'OFF'),
    ]

    mount(CRelayVerticalBar, {
      props: { schedule, currentTime: timeUnitHelper('13:00:00') },
    })

    cy.dataCy('interval').should('have.length', 2)
  })
})
