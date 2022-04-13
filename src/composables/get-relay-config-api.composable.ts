import { DateTime } from 'luxon'
import {
  ApiResponse,
  BaseApiFetchComposable,
} from 'src/types/base-api-fetch-composable.interface'
import { DeviceModuleIdentifier } from 'src/types/device.interface'
import { RelayConfig } from 'src/types/relay-config.interface'
import { useLoadingComputed } from 'src/utils/fetch-api-composable.utils'
import { inject, InjectionKey, ref, Ref } from 'vue'
import { useApi } from './axios.composable'

type GetRelayConfigApi = BaseApiFetchComposable<RelayConfig>

function getRelayConfigBackend({
  deviceId,
  firmwareVersion,
  moduleId,
}: DeviceModuleIdentifier): GetRelayConfigApi {
  const api = useApi()

  const response: Ref<ApiResponse<RelayConfig> | undefined> = ref()
  const requestTime: Ref<DateTime | undefined> = ref()

  const loading = useLoadingComputed({ response, requestTime })

  async function fetch(): Promise<void> {
    if (loading.value) {
      console.warn('getRelayConfigBackend: prevented duplicate HTTP call')
      return
    }

    const url = `device/${deviceId}/version/${firmwareVersion}/relay/${moduleId}`

    requestTime.value = DateTime.now()
    try {
      console.debug(
        'getRelayConfigBackend: fetching config from endpoint %s',
        url
      )
      const { data } = await api.get<RelayConfig>(url)

      console.debug('getRelayConfigBackend: fetch successful')
      response.value = {
        type: 'success',
        data,
        responseTime: DateTime.now(),
      }
    } catch (error) {
      console.warn('getRelayConfigBackend: encountered an error', error)
      response.value = {
        type: 'error',
        error: error as Error,
        responseTime: DateTime.now(),
      }
    }
  }

  return {
    response,
    requestTime,
    fetch,
    loading,
  }
}

const GET_RELAY_CONFIG_API: InjectionKey<GetRelayConfigApi> = Symbol(
  'get relay config api'
)

export function useGetRelayConfigApi(query: DeviceModuleIdentifier) {
  return inject(GET_RELAY_CONFIG_API, () => getRelayConfigBackend(query), true)
}
