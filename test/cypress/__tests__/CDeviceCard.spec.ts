import { mount } from '@cypress/vue'
import CDeviceCard from 'components/CDeviceCard.vue'
import { DateTime } from 'luxon'
import { Device } from 'src/types/device.interface'

describe('CDeviceCard', () => {
  const device: Device = {
    deviceId: 'this-is-a-device-id',
    modules: [
      {
        type: 'SWITCH',
        moduleId: 'switch-1',
      },
      {
        type: 'SWITCH',
        moduleId: 'switch-2',
      },
      {
        type: 'SWITCH',
        moduleId: 'switch-3',
      },
      {
        type: 'PH_SENSOR',
        moduleId: 'ph-sensor-1',
      },
    ],
    firmwareVersion: '6.2.1',
    alias: 'my device',
  }

  const props = {
    lastHeartbeatDt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    refDt: DateTime.fromISO('2022-01-01T00:00:01.000Z'),
    heartbeatLapseThreshold: 5000,
    device,
    lastFetchDt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
  }

  beforeEach(() => {
    if (
      Cypress.currentTest.title ===
      'should show no alias if alias is not available'
    ) {
      return
    }

    mount(CDeviceCard, { props })
  })

  it('should show the alias if available', () => {
    cy.dataCy('alias').should('contain', device.alias)
    cy.dataCy('no-alias').should('not.exist')
  })

  it('should show no alias if alias is not available', () => {
    mount(CDeviceCard, {
      props: {
        ...props,
        device: {
          ...device,
          alias: null,
        },
      },
    })

    cy.dataCy('alias').should('not.exist')
    cy.dataCy('no-alias').should('exist')
  })

  it('should show static details', () => {
    cy.dataCy('last-fetch').should('exist')
    cy.dataCy('device-id').should('contain', device.deviceId)
    cy.dataCy('version').should('contain', device.firmwareVersion)
  })
})
