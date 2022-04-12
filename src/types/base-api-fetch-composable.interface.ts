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

export type ApiResponse<T> = ErrorResponse | SuccessResponse<T>

export interface BaseApiFetchComposable<T = unknown> {
  response: Ref<ApiResponse<T> | undefined>
  fetch: () => Promise<ApiResponse<T>>
  requestTime: Ref<DateTime | undefined>
  loading: Ref<boolean>
}
