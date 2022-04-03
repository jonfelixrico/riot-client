import { DeviceModule } from 'src/types/device.interface'
import { mount } from '@cypress/vue'
import CDeviceModuleBase from 'components/CDeviceModuleBase.vue'

describe('CDeviceModuleBase', () => {
  const deviceModule: DeviceModule = {
    moduleId: 'switch-1',
    type: 'SWITCH',
    alias: 'Switch Module',
  }

  it('should show alias if available', () => {
    mount(CDeviceModuleBase, {
      props: {
        deviceModule,
      },
    })

    cy.dataCy('label-alias').should('contain', deviceModule.alias)
    cy.dataCy('device-id').should('exist')
    cy.dataCy('label-id').should('not.exist')
  })

  it('should show device module if alias is not available', () => {
    mount(CDeviceModuleBase, {
      props: {
        deviceModule: {
          ...deviceModule,
          alias: null,
        },
      },
    })

    cy.dataCy('label-alias').should('not.exist')
    cy.dataCy('device-id').should('not.exist')
    cy.dataCy('label-id').should('exist')
  })
})
