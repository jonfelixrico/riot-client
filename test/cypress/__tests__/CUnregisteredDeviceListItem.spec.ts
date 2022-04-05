import { mount } from '@cypress/vue'
import CUnregisteredDeviceItem from 'components/unregistered-devices/CUnregisteredDeviceListItem.vue'
import { DateTime } from 'luxon'
import { i18n } from 'src/boot/i18n'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'

describe('CUnregisteredDeviceListItem', () => {
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
    mount(CUnregisteredDeviceItem, {
      props: { device },
      global: {
        plugins: [i18n],
      },
    })
  })

  it('should render the device details', () => {
    cy.dataCy('device-id').should('exist')
    cy.dataCy('version').should('exist')
    cy.dataCy('last-activity').should('exist')
  })

  it('should render the module summary', () => {
    cy.dataCy('module-group').should('have.length', 2)
    cy.dataCy('module-group').get('[data-module-type="SWITCH"]').should('exist')
    cy.dataCy('module-group')
      .get('[data-module-type="PH_SENSOR"]')
      .should('exist')
  })

  it('should render the register button', () => {
    cy.dataCy('register-btn')
      .should('exist')
      .click()
      .should(() => {
        expect(Cypress.vueWrapper.emitted('register-click')).to.have.lengthOf(1)
      })
  })
})
