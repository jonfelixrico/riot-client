import { DeviceModuleIdentifier } from 'src/types/device.interface'
import { RelayConfig } from 'src/types/relay-config.interface'
import { inject, InjectionKey, ref, Ref } from 'vue'
import { useApi } from './axios.composable'

interface GetRelayConfigApi {
  relayConfig: Ref<RelayConfig | null>
  fetch: () => Promise<void>
  loading: Ref<boolean>
}

function getRelayConfigBackend({
  deviceId,
  firmwareVersion,
  moduleId,
}: DeviceModuleIdentifier): GetRelayConfigApi {
  const api = useApi()

  const relayConfig: Ref<RelayConfig | null> = ref(null)
  const loading = ref(false)

  async function fetch(): Promise<void> {
    if (loading.value) {
      console.warn('getRelayConfigBackend: prevented duplicate HTTP call')
      return
    }

    const url = `device/${deviceId}/version/${firmwareVersion}/switch/${moduleId}`

    loading.value = true
    try {
      console.debug(
        'getRelayConfigBackend: fetching config from endpoint %s',
        url
      )
      const { data } = await api.get<RelayConfig>(url)

      relayConfig.value = data
      console.debug('getRelayConfigBackend: fetch successful')
    } finally {
      loading.value = false
    }
  }

  return {
    relayConfig,
    loading,
    fetch,
  }
}

const GET_RELAY_CONFIG_API: InjectionKey<GetRelayConfigApi> = Symbol(
  'get relay config API'
)

export function useGetRelayConfigApi(query: DeviceModuleIdentifier) {
  return inject(GET_RELAY_CONFIG_API, () => getRelayConfigBackend(query), true)
}
