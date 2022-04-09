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

  test('same-day result -- +7 to UTC', () => {
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

  test('previous-day result -- +8 to UTC', () => {
    const { time, dayOffset } = convertOffset(
      {
        hour: 0,
        minute: 0,
        second: 0,
        offset: 8 * 60,
      },
      0
    )

    expect(time).toEqual({
      hour: 16,
      minute: 0,
      second: 0,
    })
    expect(dayOffset).toBe(-1)
  })

  test('previous-day result -- UTC to +8:30', () => {
    const { time, dayOffset } = convertOffset(
      {
        hour: 0,
        minute: 0,
        second: 5,
        offset: 8 * 60 + 30,
      },
      0
    )

    expect(time).toEqual({
      hour: 15,
      minute: 30,
      second: 5,
    })
    expect(dayOffset).toBe(-1)
  })

  test('next-day result -- UTC to +8', () => {
    const { time, dayOffset } = convertOffset(
      {
        hour: 16,
        minute: 0,
        second: 0,
        offset: 0,
      },
      8 * 60
    )

    expect(time).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    })
    expect(dayOffset).toBe(1)
  })
})
