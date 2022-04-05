import {
  UnregisteredListApi,
  UNREGISTERED_LIST_API,
} from 'src/composables/unregistered-api.composable'
import { mount } from '@cypress/vue'
import LayoutContainer from 'app/test/cypress/wrappers/LayoutContainer.vue'
import UnregisteredDeviceList from 'pages/UnregisteredDeviceList.vue'
import { ref } from 'vue'
import { UnregisteredDevice } from 'types/unregistered-device.interface'
import { DateTime } from 'luxon'
import { i18n } from 'boot/i18n'

const devices: UnregisteredDevice[] = [
  {
    deviceId: 'device-1',
    firmwareVersion: '1',
    lastQueueDt: DateTime.fromISO('2022-01-01T00:00:00Z'),
    modules: [
      {
        moduleId: 'module-1',
        type: 'SWITCH',
      },
    ],
  },
]

describe('UnregisteredDeviceList', () => {
  it('should display all devices', () => {
    mount(LayoutContainer, {
      props: {
        component: UnregisteredDeviceList,
      },
      global: {
        provide: {
          [UNREGISTERED_LIST_API as symbol]: {
            devices: ref(devices),
          } as UnregisteredListApi,
        },
        plugins: [i18n],
      },
    })

    cy.dataCy('device').should('have.length', devices.length)
  })
})
