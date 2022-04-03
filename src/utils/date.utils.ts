import { DateTime } from 'luxon'

export const EPOCH = DateTime.fromMillis(0)

export function getRelativeFormattingToken(
  toFormat: DateTime,
  relativeTo?: DateTime
) {
  relativeTo = relativeTo ?? DateTime.now()
  if (toFormat.hasSame(relativeTo, 'day')) {
    return DateTime.TIME_SIMPLE
  }

  return DateTime.DATETIME_MED_WITH_SECONDS
}
