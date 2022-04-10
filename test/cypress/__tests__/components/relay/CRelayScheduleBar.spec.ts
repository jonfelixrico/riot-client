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
  const items: ScheduleBarItem[] = [
    scheduleHelper(1, '00:00:00', '11:00:00', 'ON'),
    scheduleHelper(2, '11:00:01', '12:59:59'),
    scheduleHelper(3, '13:00:00', '23:59:59', 'OFF'),
  ]

  it('should display interval details', () => {
    mount(CRelayScheduleBar, {
      props: { items },
    })

    cy.dataCy('item').should('have.length', items.length)
  })

  it('should handle active items', () => {
    mount(CRelayScheduleBar, {
      props: { items, activeId: '1' },
    })

    cy.dataCy('item')
      .get('[data-item-id="1"]')
      .should('have.attr', 'data-active', 'true')
  })
})
