import { mount } from '@cypress/vue'
import CHorizontalSchedulePreview from 'components/relay/CHorizontalSchedulePreview.vue'
import { DateTime } from 'luxon'
import { PRESENTATION_SCHEDULE_ENTRY_ARR } from './relay-schedule.test-data'

describe('CHorizontalSchedulePreview', () => {
  const entries = PRESENTATION_SCHEDULE_ENTRY_ARR

  it('should show a time indicator if the current time was provided', () => {
    mount(CHorizontalSchedulePreview, {
      props: {
        entries,
        // Yes, machine local time. This will cause the indicator to appear in the middle
        now: DateTime.fromISO('2022-01-01T12:00:00'),
      },
    })

    cy.dataCy('time-indicator').should('exist')
  })

  it('should not show a time indicator if the current time was not provided', () => {
    mount(CHorizontalSchedulePreview, {
      props: {
        entries,
      },
    })

    cy.dataCy('time-indicator').should('not.exist')
  })

  it('should display the schedule', () => {
    mount(CHorizontalSchedulePreview, {
      props: {
        entries,
      },
    })

    cy.dataCy('schedule-display').should('exist')
  })

  // TODO maybe test if the width behavior is working properly?
})
