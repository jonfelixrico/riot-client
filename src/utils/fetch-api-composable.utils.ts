import { computed } from 'vue'
import { BaseApiFetchComposable } from 'types/base-api-fetch-composable.interface'

export function useLoadingComputed({
  requestTime,
  response,
}: Pick<BaseApiFetchComposable, 'requestTime' | 'response'>) {
  return computed(() => {
    if (!requestTime.value) {
      // no requests made yet
      return false
    }

    return (
      !response.value || // might mean that response has not yet arrived for initial request
      response.value.responseTime < requestTime.value // might mean that a newer request has been created
    )
  })
}
