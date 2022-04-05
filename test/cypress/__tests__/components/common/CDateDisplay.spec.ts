import { mount } from '@cypress/vue'
import CDateDisplay from 'components/common/CDateDisplay.vue'
import { DateTime } from 'luxon'

describe('CDateDisplay', () => {
  it('should show the absolute date if not the same day', () => {
    mount(CDateDisplay, {
      props: {
        date: DateTime.fromISO('2022-01-01T00:00:00Z'),
        refDt: DateTime.fromISO('2022-01-31T00:00:00Z'),
      },
    })

    cy.dataCy('absolute').should('exist')
    cy.dataCy('relative').should('not.exist')
  })

  it('should show relative date if has the same day', () => {
    mount(CDateDisplay, {
      props: {
        date: DateTime.fromISO('2022-01-01T00:00:00Z'),
        refDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
      },
    })

    cy.dataCy('absolute').should('not.exist')
    cy.dataCy('relative').should('exist')
  })

  it('should show tooltip if has the same day and date is hovered', () => {
    mount(CDateDisplay, {
      props: {
        date: DateTime.fromISO('2022-01-01T00:00:00Z'),
        refDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
      },
    })

    cy.dataCy('absolute-tooltip').should('not.exist')

    cy.dataCy('relative').trigger('mouseover', () => {
      cy.dataCy('absolute-tooltip').should('be.visible')
    })
  })
})
