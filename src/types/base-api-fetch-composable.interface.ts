import { DateTime } from 'luxon'
import { Ref } from 'vue'

interface ErrorResponse {
  type: 'error'
  error: Error
  responseTime: DateTime
}

interface SuccessResponse<T> {
  type: 'success'
  data: T
  responseTime: DateTime
}

export interface BaseApiFetchComposable<T = unknown> {
  response: Ref<ErrorResponse | SuccessResponse<T>>
  fetch: () => Promise<ErrorResponse | SuccessResponse<T>>
  requestTime: Ref<DateTime>
  loading: Ref<boolean>
}
