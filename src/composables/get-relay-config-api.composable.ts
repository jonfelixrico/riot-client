import { DeviceModuleIdentifier } from 'src/types/device.interface'
import { RelayConfig } from 'src/types/relay-config.interface'
import { inject, InjectionKey, ref, Ref } from 'vue'
import { useApi } from './axios.composable'

interface GetRelayConfigApi {
  relayConfig: Ref<RelayConfig | null>
  fetch: () => Promise<void>
  loading: Ref<boolean>
}

function useBackend({
  deviceId,
  firmwareVersion,
  moduleId,
}: DeviceModuleIdentifier): GetRelayConfigApi {
  const api = useApi()

  const relayConfig: Ref<RelayConfig | null> = ref(null)
  const loading = ref(false)

  async function fetch(): Promise<void> {
    if (loading.value) {
      return
    }

    loading.value = true
    try {
      const { data } = await api.get<RelayConfig>(
        `device/${deviceId}/version/${firmwareVersion}/switch/${moduleId}`
      )

      relayConfig.value = data
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
  return inject(GET_RELAY_CONFIG_API, () => useBackend(query), true)
}
