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

/*
 * We're separating these empty and non-empty scenarios to simplify the before hook.
 */

describe('UnregisteredDeviceList -- empty', () => {
  let mockApi: UnregisteredListApi

  beforeEach(() => {
    mockApi = {
      devices: ref([]),
      fetch: cy.stub(),
      isLoading: ref(false),
    }

    mount(LayoutContainer, {
      props: {
        component: UnregisteredDeviceList,
      },
      global: {
        provide: {
          [UNREGISTERED_LIST_API as symbol]: mockApi,
        },
        plugins: [i18n],
      },
    })
  })

  it('should show empty indicator if there are no items', () => {
    cy.dataCy('listing').should('not.exist')
    cy.dataCy('empty-ind').should('exist')
  })

  it('should have a refresh button accessible', () => {
    cy.dataCy('refresh-btn')
      .click()
      .should(() => {
        expect(mockApi.fetch).to.be.called
      })
  })
})

describe('UnregisteredDeviceList -- not empty', () => {
  let mockApi: UnregisteredListApi

  beforeEach(() => {
    mockApi = {
      devices: ref(devices),
      fetch: cy.stub(),
      isLoading: ref(false),
    }

    mount(LayoutContainer, {
      props: {
        component: UnregisteredDeviceList,
      },
      global: {
        provide: {
          [UNREGISTERED_LIST_API as symbol]: mockApi,
        },
        plugins: [i18n],
      },
    })
  })

  it('should should show the devices', () => {
    cy.dataCy('device').should('have.length', devices.length)
  })

  it('should have a refresh button accessible', () => {
    cy.dataCy('refresh-btn')
      .click()
      .should(() => {
        expect(mockApi.fetch).to.be.called
      })
  })
})
