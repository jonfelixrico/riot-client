import { mount } from '@cypress/vue'
import CDeviceListItem from 'components/CDeviceListItem.vue'
import { DateTime } from 'luxon'

describe('CDeviceListItem', () => {
  const props = {
    lastHeartbeatDt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
  }

  it('should show the online indicator if time has not yet lapsed', () => {
    mount(CDeviceListItem, {
      props: {
        ...props,
        refDt: DateTime.fromISO('2022-01-01T00:00:03.000Z'),
        heartbeatLapseThreshold: 5000, // lapsed for 1 hour
      },
    })

    cy.dataCy('online-ind').should('exist')
    cy.dataCy('offline-ind').should('not.exist')
  })

  it('should show the offline indicator if time has lapsed', () => {
    mount(CDeviceListItem, {
      props: {
        ...props,
        refDt: DateTime.fromISO('2022-01-01T00:00:06.000Z'),
        heartbeatLapseThreshold: 5000,
      },
    })

    cy.dataCy('online-ind').should('not.exist')
    cy.dataCy('offline-ind').should('exist')
  })
})
