import { mount } from '@cypress/vue'
import CDeviceListItem from 'components/CDeviceListItem.vue'
import { DateTime } from 'luxon'

describe('CDeviceListItem', () => {
  const props = {
    lastHeartbeatDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
  }

  it('should show the online button', () => {
    mount(CDeviceListItem, {
      props: {
        ...props,
        reftDt: DateTime.fromISO('2022-01-01T01:00:00Z'),
      },
    })

    cy.dataCy('online-ind').should('exist')
    cy.dataCy('offline-ind').should('not.exist')
  })
})
