import { DeviceModule } from 'src/types/device.interface'
import { mount } from '@cypress/vue'
import CDeviceModuleList from 'components/CDeviceModuleList.vue'

describe('CDeviceModuleList', () => {
  const deviceModules: DeviceModule[] = [
    {
      moduleId: 'switch-1',
      type: 'SWITCH',
      alias: 'Switch 1',
    },
    {
      moduleId: 'switch-2',
      type: 'SWITCH',
      alias: 'Switch 2',
    },
    {
      moduleId: 'switch-3',
      type: 'SWITCH',
      alias: 'Switch 3',
    },
    {
      moduleId: 'switch-4',
      type: 'SWITCH',
      alias: 'Switch 4',
    },
    {
      moduleId: 'switch-5',
      type: 'SWITCH',
      alias: 'Switch 5',
    },
    {
      moduleId: 'ph-sensor-1',
      type: 'PH_SENSOR',
      alias: 'PH sensor 1',
    },
  ]

  beforeEach(() => {
    mount(CDeviceModuleList, {
      props: {
        deviceModules,
      },
    })
  })

  it('should render the correct number of modules', () => {
    cy.dataCy('device-module').should('have.length', deviceModules.length)
  })
})
