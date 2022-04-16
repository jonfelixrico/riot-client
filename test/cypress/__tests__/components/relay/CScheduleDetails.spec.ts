import { mount } from '@cypress/vue'
import { MAX_SECONDS } from 'components/relay/relay.constants'
import CScheduleDetails from 'components/relay-details/CScheduleDetails.vue'
import { i18n } from 'boot/i18n'

describe('CScheduleDetails', () => {
  it('should schedule details', () => {
    mount(CScheduleDetails, {
      props: {
        modelValue: [
          {
            start: 0,
            end: Math.floor(MAX_SECONDS / 2),
            state: 'ON',
          },
          {
            start: Math.floor(MAX_SECONDS / 2) + 1,
            end: MAX_SECONDS,
            state: 'OFF',
          },
        ],
      },
      global: {
        plugins: [i18n],
      },
    })
  })
})
