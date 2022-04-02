import { Device } from 'src/types/device.interface'
import { mount } from '@cypress/vue'
import CDeviceList from 'components/CDeviceList.vue'
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

  const lastHeartbeats: Record<string, DateTime> = {}

  const props = {
    devices,
    lastHeartbeats,
    refDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
    heartbeatLapseThreshold: 5000,
  }

  it('should list down all devices', () => {
    mount(CDeviceList, {
      props,
    })

    cy.dataCy('list-item').should('have.length', 3)
    cy.get('[data-device-id="device-1"]').should('exist')
    cy.get('[data-device-id="device-2"]').should('exist')
    cy.get('[data-device-id="device-3"]').should('exist')
  })
})
