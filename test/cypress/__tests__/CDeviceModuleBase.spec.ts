import { DeviceModule } from 'src/types/device.interface'
import { mount } from '@cypress/vue'
import CDeviceModuleBase from 'components/CDeviceModuleBase.vue'

describe('CDeviceModuleBase', () => {
  const deviceModule: DeviceModule = {
    moduleId: 'switch-1',
    type: 'SWITCH',
    alias: 'Switch Module',
  }

  const props = {
    deviceModule,
    headingLevel: 6,
  }

  it('should show alias if available', () => {
    mount(CDeviceModuleBase, {
      props,
    })

    cy.dataCy('label-alias').should('contain', deviceModule.alias)
    cy.dataCy('module-id').should('exist')
    cy.dataCy('label-id').should('not.exist')
  })

  it('should show device module if alias is not available', () => {
    mount(CDeviceModuleBase, {
      props: {
        ...props,
        deviceModule: {
          ...deviceModule,
          alias: null,
        },
      },
    })

    cy.dataCy('label-alias').should('not.exist')
    cy.dataCy('module-id').should('not.exist')
    cy.dataCy('label-id').should('exist')
  })

  it('should show static elements', () => {
    mount(CDeviceModuleBase, {
      props,
    })

    cy.dataCy('label-container').should(
      'have.attr',
      'aria-level',
      props.headingLevel
    )
    cy.dataCy('type').should('exist')
  })
})
