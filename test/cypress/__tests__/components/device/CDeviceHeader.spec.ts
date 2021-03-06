import { mount } from '@cypress/vue'
import CDeviceHeader from 'components/device/CDeviceHeader.vue'
import { DateTime } from 'luxon'
import { Device } from 'src/types/device.interface'

describe('CDeviceHeader', () => {
  const device: Omit<Device, 'modules'> = {
    deviceId: 'this-is-a-device-id',
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

  it('should show the alias if available', () => {
    mount(CDeviceHeader, { props })

    cy.dataCy('label-alias').should('contain', device.alias)
    cy.dataCy('caption-id').should('exist')

    cy.dataCy('label-id').should('not.exist')
    cy.dataCy('caption-no-alias').should('not.exist')
  })

  it('should show id instead if alias is not available', () => {
    mount(CDeviceHeader, {
      props: {
        ...props,
        device: {
          ...device,
          alias: null,
        },
      },
    })

    cy.dataCy('label-alias').should('not.exist')
    cy.dataCy('caption-id').should('not.exist')

    cy.dataCy('label-id').should('exist')
    cy.dataCy('caption-no-alias').should('exist')
  })

  it('should show static elements', () => {
    mount(CDeviceHeader, { props })

    cy.dataCy('version').should('contain', device.firmwareVersion)
  })

  it('should show the online indicator', () => {
    mount(CDeviceHeader, { props })
    cy.dataCy('online-ind').should('exist')
    cy.dataCy('offline-ind').should('not.exist')
  })

  it('should show the offline indicator', () => {
    mount(CDeviceHeader, {
      props: {
        ...props,
        lastHeartbeatDt: DateTime.fromISO('2021-12-25T00:00:00Z'),
      },
    })

    cy.dataCy('offline-ind').should('exist')
    cy.dataCy('online-ind').should('not.exist')
  })
})
