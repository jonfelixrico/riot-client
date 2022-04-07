import {
  UnregisteredListApi,
  UNREGISTERED_LIST_API,
} from 'src/composables/unregistered-list-api.composable'
import { mount } from '@cypress/vue'
import LayoutContainer from 'app/test/cypress/wrappers/LayoutContainer.vue'
import UnregisteredDeviceList from 'pages/UnregisteredDeviceList.vue'
import { ref } from 'vue'
import { UnregisteredDevice } from 'types/unregistered-device.interface'
import { DateTime } from 'luxon'
import { i18n } from 'boot/i18n'
import {
  RegisterDeviceApi,
  REGISTER_DEVICE_API,
} from 'src/composables/register-device-api.composable'

const DEVICE_1 = 'device-1'

const devices: UnregisteredDevice[] = [
  {
    deviceId: DEVICE_1,
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
  let listApi: UnregisteredListApi
  let regApi: RegisterDeviceApi

  beforeEach(() => {
    listApi = {
      devices: ref([]),
      fetch: cy.stub(),
      isLoading: ref(false),
    }

    regApi = {
      register: cy.stub(),
    }

    mount(LayoutContainer, {
      props: {
        component: UnregisteredDeviceList,
      },
      global: {
        provide: {
          [UNREGISTERED_LIST_API as symbol]: listApi,
          [REGISTER_DEVICE_API as symbol]: regApi,
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
    cy.dataCy('empty-ind')
      .dataCy('refresh-btn')
      .click()
      .should(() => {
        expect(listApi.fetch).to.be.called
      })
  })
})

describe('UnregisteredDeviceList -- not empty', () => {
  let listApi: UnregisteredListApi
  let regApi: RegisterDeviceApi

  function doMount(listApiOverrides?: Partial<UnregisteredListApi>) {
    listApi = {
      devices: ref(devices),
      fetch: listApiOverrides?.fetch ?? cy.stub(),
      isLoading: ref(false),
    }

    regApi = {
      register: cy.stub(),
    }

    mount(LayoutContainer, {
      props: {
        component: UnregisteredDeviceList,
      },
      global: {
        provide: {
          [UNREGISTERED_LIST_API as symbol]: listApi,
          [REGISTER_DEVICE_API as symbol]: regApi,
        },
        plugins: [i18n],
      },
    })
  }

  it('should should show the devices', () => {
    doMount()

    cy.dataCy('device').should('have.length', devices.length)
  })

  it('should have a refresh button accessible', () => {
    doMount()

    cy.dataCy('listing')
      .dataCy('refresh-btn')
      .click()
      .should(() => {
        expect(listApi.fetch).to.be.called
      })
  })

  it('should dismiss the prompt', () => {
    doMount()

    cy.dataCy('device')
      .get(`[data-device-id=${DEVICE_1}]`)
      .dataCy('register-btn')
      .click()

    cy.dataCy('register-confirm').should('exist').dataCy('cancel').click()

    cy.dataCy('register-confirm').should('not.exist')
  })

  it('should trigger registration on confirm', () => {
    doMount()

    cy.dataCy('device')
      .get(`[data-device-id=${DEVICE_1}]`)
      .dataCy('register-btn')
      .click()

    cy.dataCy('register-confirm')
      .should('exist')
      .dataCy('ok')
      .click()
      .should(() => {
        expect(regApi.register).to.be.called
      })

    cy.dataCy('register-confirm').should('not.exist') // OK dismisses the dialog
  })
})
