import { defineStore } from 'pinia'
import { convertSingleOnScheduleToScheduleArray } from 'src/components/relay-details/set-schedule.utils'

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

export const useSetScheduleStore = defineStore('setStore', {
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
        return null
      }

      return convertSingleOnScheduleToScheduleArray(start, end)
    },
  },
  actions: {
    setSingleOnSchedule(input: { start?: string; end?: string }) {
      if (input.start) {
        this.singleOn.start = input.start
      }

      if (input.end) {
        this.singleOn.end = input.end
      }
    },
  },
})
