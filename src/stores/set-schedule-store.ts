import { defineStore } from 'pinia'
import { convertSingleOnScheduleToScheduleArray } from 'src/components/relay-details/set-schedule.utils'

export interface SetScheduleStore {
  singleOn: {
    start: string | null
    end: string | null
  }

  cycle: {
    onDuration: number | null
    offDuration: number | null
    firstState: 'ON' | 'OFF'
  }
}

export const useSetScheduleStore = defineStore('setStore', {
  state: (): SetScheduleStore => ({
    singleOn: {
      start: null,
      end: null,
    },

    cycle: {
      onDuration: null,
      offDuration: null,
      firstState: 'ON',
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
