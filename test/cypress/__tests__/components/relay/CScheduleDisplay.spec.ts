import { mount } from '@cypress/vue'
import CScheduleDisplay from 'components/relay/CScheduleDisplay.vue'
import { PRESENTATION_SCHEDULE_ENTRY_ARR } from './relay-schedule.test-data'

describe('CScheduleDisplay', () => {
  const items = PRESENTATION_SCHEDULE_ENTRY_ARR

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

  it('should emit the activeIndex update if clickable', () => {
    mount(CScheduleDisplay, {
      props: { items, clickable: true },
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

  it('should NOT emit the activeIndex update if not clickable', () => {
    mount(CScheduleDisplay, {
      props: { items, clickable: false },
    })

    cy.dataCy('item')
      .get('[data-index="1"]')
      .dblclick()
      .should(() => {
        const value =
          Cypress.vueWrapper.emitted<[string]>('update:activeIndex')?.[0]?.[0]
        expect(value).to.be.undefined
      })
  })
})
