import { DateTime } from 'luxon'
import { WeeklySchedule } from 'src/types/relay-config.interface'
import { timeStringToScheduleEntry } from './relay-schedule.test-utils'
import { mount } from '@cypress/vue'
import CWeeklySchedulePreview from 'components/relay/CWeeklySchedulePreview.vue'
import { i18n } from 'src/boot/i18n'

const scheduleArr = [
  timeStringToScheduleEntry('00:00:00', '12:00:00', 'ON'),
  timeStringToScheduleEntry('12:00:01', '23:59:59', 'OFF'),
]

const weeklySchedule: WeeklySchedule['weeklySchedule'] = {
  mon: scheduleArr,
  tues: scheduleArr,
  wed: scheduleArr,
  thurs: scheduleArr,
  fri: scheduleArr,
  sat: scheduleArr,
  sun: scheduleArr,
}

const props = {
  weeklySchedule,
  utcOffset: '+8',
  now: DateTime.fromISO('2022-01-05T00:00:00+08:00', {
    // wednesday
    setZone: true,
  }),
}

describe('CWeeklySchedulePreview', () => {
  beforeEach(() => {
    mount(CWeeklySchedulePreview, {
      props,
      global: {
        plugins: [i18n],
      },
    })
  })

  it('should have a visual representation for each day', () => {
    cy.dataCy('dow-item').should('have.length', 7)
    cy.dataCy('dow-item').get('[data-day="mon"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="tues"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="wed"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="thurs"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="fri"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="sat"]').should('exist')
    cy.dataCy('dow-item').get('[data-day="sun"]').should('exist')
  })

  it('should indicate the current day', () => {
    cy.dataCy('dow-item')
      .get('[data-day="wed"]')
      .should('have.attr', 'data-current-day', 'true')

    cy.dataCy('dow-item')
      .get('[data-current-day="true"]')
      .should('have.length', 1)
  })

  it('each schedule should display the correct number of sub-bars', () => {
    /*
     * NOTE: schedule-display and item are from a sub-component of CWeeklySchedulePreview
     * Maybe I shouldn't include these kind of tests...?
     */

    cy.dataCy('dow-item')
      .get('[data-day="mon"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="tues"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="wed"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="thurs"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="fri"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="sat"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)

    cy.dataCy('dow-item')
      .get('[data-day="sun"]')
      .dataCy('schedule-display')
      .dataCy('item')
      .should('have.length', scheduleArr.length)
  })
})
