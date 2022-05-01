export default {
  daysOfWeek: {
    mon: 'Monday',
    tues: 'Tuesday',
    wed: 'Wednesday',
    thurs: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },

  timeSlotLabel: {
    on: 'On',
    off: 'Off',
    format: '{state} from {start} to {end}',
  },

  setSchedule: 'Set Schedule',
  setScheduleType: {
    singleOn: 'Single On',
    cycle: 'Cyclical',
  },

  dialogs: {
    setSchedule: {
      title: 'Set Schedule',
      ok: 'Save',
    },
  },

  cyclicalInput: {
    on: {
      label: 'Duration On',
      hint: 'In minutes',
    },

    off: {
      label: 'Duration Off',
      hint: 'In minutes',
    },

    firstState: {
      on: {
        label: 'Turn on first',
      },

      off: {
        label: 'Turn off first',
      },
    },
  },

  singleOnInput: {
    start: {
      label: 'Starts at',
    },

    end: {
      label: 'Ends at',
    },
  },
}
