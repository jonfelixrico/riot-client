import { useQuasar } from 'quasar'
import { DeviceModuleIdentifier } from 'src/types/device.interface'
import CSetScheduleDialog from 'components/relay-details/set-schedule-dialog/CSetScheduleDialog.vue'
import { PresentationScheduleEntry } from '../relay-schedule-presentation.utils'
import { useApi } from 'src/composables/axios.composable'

export function useRelayEditDialog({
  deviceId,
  firmwareVersion,
  moduleId,
}: DeviceModuleIdentifier) {
  const $q = useQuasar()
  const axios = useApi()

  function showDialog() {
    $q.dialog({
      component: CSetScheduleDialog,
    }).onOk((value: PresentationScheduleEntry[]) => {
      axios.post(
        `device/${deviceId}/version/${firmwareVersion}/relay/${moduleId}`,
        {}
      )
    })
  }
}
