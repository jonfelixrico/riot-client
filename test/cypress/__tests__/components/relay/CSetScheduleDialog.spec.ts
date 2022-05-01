import DialogWrapper from 'app/test/cypress/wrappers/DialogWrapper.vue'
import CSetScheduleDialog from 'components/relay-details/CSetScheduleDialog.vue'

import { mount } from '@cypress/vue'
import { i18n } from 'boot/i18n'

describe('CSetScheduleDialog', () => {
  it('should render', () => {
    mount(DialogWrapper, {
      props: {
        component: CSetScheduleDialog,
      },
      global: {
        plugins: [i18n],
      },
    })
  })
})
