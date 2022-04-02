import { mount } from '@cypress/vue'
import CDeviceListItem from 'components/CDeviceListItem.vue'
import { DateTime } from 'luxon'

describe('CDeviceListItem', () => {
  const props = {
    lastHeartbeatDt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    refDt: DateTime.fromISO('2022-01-01T00:00:01.000Z'),
    heartbeatLapseThreshold: 5000,
    device: {
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
    },
  }

  it('should show the online indicator if time has not yet lapsed', () => {
    mount(CDeviceListItem, {
      props: {
        ...props,
        refDt: DateTime.fromISO('2022-01-01T00:00:03.000Z'),
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
      },
    })

    cy.dataCy('online-ind').should('not.exist')
    cy.dataCy('offline-ind').should('exist')
  })

  it('should show the device id', () => {
    mount(CDeviceListItem, {
      props,
    })

    cy.dataCy('device-id').should('contain.text', props.device.deviceId)
  })

  it('should show chips to indicate modules', () => {
    mount(CDeviceListItem, {
      props,
    })

    cy.dataCy('module-chip-SWITCH').dataCy('count').should('contain.text', 3)
    cy.dataCy('module-chip-PH_SENSOR').dataCy('count').should('contain.text', 1)
  })
})
