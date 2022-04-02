import { DateTime } from 'luxon'
import { ref } from 'vue'

/**
 * This updates the date every second.
 */
const dateTime = ref(DateTime.now())
setInterval(() => {
  dateTime.value = DateTime.now()
}, 1000)

export function useTickingDateTime() {
  return {
    now: dateTime,
  }
}
