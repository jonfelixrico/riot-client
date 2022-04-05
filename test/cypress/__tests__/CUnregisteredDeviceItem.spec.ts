import { mount } from '@cypress/vue'
import CUnregisteredDeviceItem from 'components/unregistered-devices/CUnregisteredDeviceItem.vue'
import { DateTime } from 'luxon'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'

describe('CUnregisteredDeviceItem', () => {
  const device: UnregisteredDevice = {
    deviceId: 'unreg-device-1',
    firmwareVersion: '1',
    lastQueueDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
    modules: [
      {
        moduleId: 'switch-1',
        type: 'SWITCH',
      },
      {
        moduleId: 'switch-2',
        type: 'SWITCH',
      },
      {
        moduleId: 'ph-1',
        type: 'PH_SENSOR',
      },
    ],
  }

  beforeEach(() => {
    mount(CUnregisteredDeviceItem, { props: { device } })
  })

  it('should render the device details', () => {
    cy.dataCy('device-id').should('exist')
    cy.dataCy('version').should('exist')
    cy.dataCy('last-queued').should('exist')
  })

  it('should render the module summary', () => {
    cy.dataCy('module-group').should('have.length', 2)
    cy.dataCy('module-group').get('[data-module-type="SWITCH"]').should('exist')
    cy.dataCy('module-group')
      .get('[data-module-type="PH_SENSOR"]')
      .should('exist')
  })
})
