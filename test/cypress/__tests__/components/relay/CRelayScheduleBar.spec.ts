import { RelayState } from 'src/utils/relay-schedule.utils'
import { mount } from '@cypress/vue'
import CRelayScheduleBar from 'components/relay/CRelayScheduleBar.vue'
import { ScheduleBarItem } from 'src/components/relay/schedule-bar.types'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

function scheduleHelper(
  id: string | number,
  startStr: string,
  endStr: string,
  state?: RelayState
): ScheduleBarItem {
  return {
    start: timeStringToSeconds(startStr),
    end: timeStringToSeconds(endStr),
    state: state ?? null,
    id: String(id),
  }
}

describe('CRelayVerticalBar', () => {
  it('should display interval details', () => {
    const schedule: ScheduleBarItem[] = [
      scheduleHelper(1, '00:00:00', '11:00:00', 'ON'),
      scheduleHelper(2, '13:00:00', '23:59:59', 'OFF'),
    ]

    mount(CRelayScheduleBar, {
      props: { schedule, currentTime: timeStringToSeconds('13:00:00') },
    })

    cy.dataCy('interval').should('have.length', 2)
  })
})
