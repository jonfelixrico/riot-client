import { defineStore } from 'pinia'
import { convertSingleOnScheduleToScheduleArray } from 'src/components/relay-details/set-schedule.utils'
import { MAX_SECONDS } from 'src/components/relay/relay.constants'

export interface SetScheduleStore {
  singleOn: {
    start: string | null
    end: string | null
  }

  cycle: {
    start: string | null
    end: string | null
  }
}

export const useSetScheduleStore = defineStore('counter', {
  state: (): SetScheduleStore => ({
    singleOn: {
      start: null,
      end: null,
    },

    cycle: {
      start: null,
      end: null,
    },
  }),
  getters: {
    singleOnSchedule({ singleOn }) {
      const { start, end } = singleOn

      if (!start || !end) {
        return [
          {
            start: 0,
            end: MAX_SECONDS,
            state: 'OFF',
          },
        ]
      }

      return convertSingleOnScheduleToScheduleArray(start, end)
    },
  },
  actions: {
    setSingleOnSchedule(start: string, end: string) {
      this.singleOn = {
        start,
        end,
      }
    },
  },
})
