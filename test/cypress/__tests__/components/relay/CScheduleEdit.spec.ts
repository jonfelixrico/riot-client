import CScheduleEdit from 'components/relay-edit/CScheduleEdit.vue'
import { mount } from '@cypress/vue'
import { MAX_SECONDS } from 'src/components/relay/relay.constants'

describe('CScheduleEdit', () => {
  it('should mount', () => {
    mount(CScheduleEdit, {
      props: {
        modelValue: [
          {
            start: 0,
            end: MAX_SECONDS / 2,
            state: 'ON',
          },
          {
            start: MAX_SECONDS / 2 + 1,
            end: MAX_SECONDS,
            state: 'OFF',
          },
        ],
      },
    })
  })
})
