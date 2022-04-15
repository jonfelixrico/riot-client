import { mount } from '@cypress/vue'
import CScheduleSlider from 'components/relay-edit/CScheduleSlider.vue'
import { MAX_SECONDS } from 'src/components/relay/relay.constants'

describe('CScheduleSlider', () => {
  it('should render a range', () => {
    mount(CScheduleSlider, {
      props: {
        modelValue: {
          start: MAX_SECONDS / 4,
          end: (MAX_SECONDS / 4) * 3,
        },
      },
    })

    cy.dataCy('slider').should('have.attr', 'data-type', 'range')
  })

  it('should render a slider', () => {
    mount(CScheduleSlider, {
      props: {
        modelValue: {
          start: MAX_SECONDS / 3,
          end: MAX_SECONDS,
        },
      },
    })

    cy.dataCy('slider').should('have.attr', 'data-type', 'reverse-slider')
  })

  it('should render a reversed slider', () => {
    mount(CScheduleSlider, {
      props: {
        modelValue: {
          start: 0,
          end: MAX_SECONDS / 4,
        },
      },
    })

    cy.dataCy('slider').should('have.attr', 'data-type', 'slider')
  })
})
