import CSetScheduleDialogContent from 'components/relay-details/set-schedule-dialog/CSetScheduleDialogContent.vue'

import { mount } from '@cypress/vue'
import { i18n } from 'boot/i18n'

describe('CSetScheduleDialogContent', () => {
  beforeEach(() => {
    mount(CSetScheduleDialogContent, {
      global: {
        plugins: [i18n],
      },
    })
  })

  it('it should show the cyclical input', () => {
    cy.dataCy('mode-radio-cycle').click()

    cy.dataCy('mode-input-cycle').should('exist')
    cy.dataCy('mode-input-single-on').should('not.exist')
  })

  it('it should show the single-on input', () => {
    cy.dataCy('mode-radio-single-on').click()

    cy.dataCy('mode-input-cycle').should('not.exist')
    cy.dataCy('mode-input-single-on').should('exist')
  })
})
