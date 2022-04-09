import { describe, it, expect } from '@jest/globals'
import { convertOffset } from 'src/utils/time.utils'

describe('convertOffset', () => {
  test('same-day result -- UTC to +7', () => {
    const { time, dayOffset } = convertOffset(
      {
        hour: 0,
        minute: 0,
        second: 0,
        offset: 0,
      },
      7 * 60
    )

    expect(time).toEqual({
      hour: 7,
      minute: 0,
      second: 0,
    })
    expect(dayOffset).toBe(0)
  })

  it('same-day result -- +7 to UTC', () => {
    const { time, dayOffset } = convertOffset(
      {
        hour: 7,
        minute: 0,
        second: 0,
        offset: 7 * 60,
      },
      0
    )

    expect(time).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    })
    expect(dayOffset).toBe(0)
  })
})
