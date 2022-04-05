import { DateTime } from 'luxon'
import { inject, InjectionKey } from 'vue'

export const STATIC_DATE_TIME: InjectionKey<DateTime> =
  Symbol('static datetime')

/**
 * Provides the DateTime during the time of composable invocation.
 * We're using this instead of statically calling `DateTime` now for easy
 * manipulation during testing.
 *
 * @returns
 */
export function useStaticDateTime() {
  const now = DateTime.now()
  return inject(STATIC_DATE_TIME, now)
}
