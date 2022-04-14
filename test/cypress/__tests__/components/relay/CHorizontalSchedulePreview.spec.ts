import { PresentationScheduleEntry } from 'src/components/relay/relay-schedule-presentation.utils'
import { scheduleFromTimeString } from './relay-schedule.test-utils'
import { mount } from '@cypress/vue'
import CHorizontalSchedulePreview from 'components/relay/CHorizontalSchedulePreview.vue'
import { DateTime } from 'luxon'

describe('CHorizontalSchedulePreview', () => {
  const entries: PresentationScheduleEntry[] = [
    scheduleFromTimeString('00:00:00', '11:00:00', 'ON'),
    scheduleFromTimeString('11:00:01', '12:59:59'),
    scheduleFromTimeString('13:00:00', '23:59:59', 'OFF'),
  ]

  it('should show a time indicator if the current time was provided', () => {
    mount(CHorizontalSchedulePreview, {
      props: {
        entries,
        now: DateTime.fromISO('2022-01-01T12:00:00Z'),
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
})
