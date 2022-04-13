import { mount } from '@cypress/vue'
import CScheduleDisplay from 'components/relay/CScheduleDisplay.vue'
import { ScheduleBarItem } from 'src/components/relay/relay.types'
import { RelayState } from 'src/types/relay-config.interface'

function timeStringToSeconds(timeStr: string): number {
  const [hour, minute, second] = timeStr.split(':').map(Number)

  return hour * 3600 + minute * 60 + second
}

function scheduleHelper(
  startStr: string,
  endStr: string,
  state?: RelayState
): ScheduleBarItem {
  return {
    start: timeStringToSeconds(startStr),
    end: timeStringToSeconds(endStr),
    state: state ?? null,
  }
}

describe('CScheduleDisplay', () => {
  const items: ScheduleBarItem[] = [
    scheduleHelper('00:00:00', '11:00:00', 'ON'),
    scheduleHelper('11:00:01', '12:59:59'),
    scheduleHelper('13:00:00', '23:59:59', 'OFF'),
  ]

  it('should display all items', () => {
    mount(CScheduleDisplay, {
      props: { items },
    })

    cy.dataCy('item').should('have.length', items.length)
  })

  it('should be able to indicate the active item', () => {
    mount(CScheduleDisplay, {
      props: { items, activeIndex: 1 },
    })

    cy.dataCy('item')
      .get('[data-index="1"]')
      .should('have.attr', 'data-active', 'true')
  })

  it('should render items horizontally if orientation is horizontal', () => {
    mount(CScheduleDisplay, {
      props: { items, orientation: 'horizontal' },
    })

    cy.dataCy('item').should(($p) => {
      const yVals = $p
        .map((_, el) => {
          const bcr = el.getBoundingClientRect()
          return bcr.y
        })
        .toArray()

      const firstVal = yVals[0]

      expect(yVals.every((val) => val === firstVal)).to.be.true
    })
  })

  it('should render items vertically if orientation is vertical', () => {
    mount(CScheduleDisplay, {
      props: { items, orientation: 'vertical' },
    })

    cy.dataCy('item').should(($p) => {
      const yVals = $p
        .map((_, el) => {
          const bcr = el.getBoundingClientRect()
          return bcr.x
        })
        .toArray()

      const firstVal = yVals[0]

      expect(yVals.every((val) => val === firstVal)).to.be.true
    })
  })

  it('should emit the active update', () => {
    mount(CScheduleDisplay, {
      props: { items },
    })

    cy.dataCy('item')
      .get('[data-index="1"]')
      .dblclick()
      .should(() => {
        const value =
          Cypress.vueWrapper.emitted<[string]>('update:activeIndex')?.[0]?.[0]
        expect(value).equals(1)
      })
  })
})
