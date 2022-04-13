import { Device } from 'types/device.interface'
import { mount } from '@cypress/vue'
import CDeviceList from 'components/device/CDeviceList.vue'
import { DateTime } from 'luxon'

describe('CDeviceList', () => {
  const devices: Device[] = [
    {
      deviceId: 'device-1',
      firmwareVersion: '1',
      modules: [],
    },
    {
      deviceId: 'device-2',
      firmwareVersion: '1',
      modules: [],
    },
    {
      deviceId: 'device-3',
      firmwareVersion: '1',
      modules: [],
    },
  ]

  const lastHeartbeats: Record<string, DateTime> = {
    'device-3': DateTime.fromISO('2022-01-01T00:00:00Z'),
    'device-2': DateTime.fromISO('2021-12-25T00:00:00Z'), // lapsed, device 2 should be offline
    // device 1 should be offline
  }

  const props = {
    devices,
    lastHeartbeats,
    refDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
    heartbeatLapseThreshold: 5000,
  }

  beforeEach(() => {
    mount(CDeviceList, {
      props,
    })
  })

  it('should list down all devices', () => {
    cy.dataCy('list-item').should('have.length', 3)
    cy.get('[data-device-id="device-1"]').should('exist')
    cy.get('[data-device-id="device-2"]').should('exist')
    cy.get('[data-device-id="device-3"]').should('exist')
  })

  it('should use the lastHeartbeats object to check for online status', () => {
    cy.get('[data-device-id="device-1"]')
      .dataCy('online-ind')
      .should('not.exist')
    cy.get('[data-device-id="device-2"]')
      .dataCy('online-ind')
      .should('not.exist')
    cy.get('[data-device-id="device-3"]').dataCy('online-ind').should('exist')
  })
})
