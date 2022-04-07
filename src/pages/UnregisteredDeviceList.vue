<template>
  <q-page class="row justify-center">
    <div
      class="page-width q-gutter-y-md q-pt-md"
      v-if="devices.length"
      data-cy="listing"
    >
      <div class="row justify-end">
        <q-btn
          unelevated
          color="secondary"
          :loading="isLoading"
          @click="fetch"
          :label="t('common.refresh')"
          no-caps
          data-cy="refresh-btn"
        />
      </div>

      <q-separator />

      <div class="q-gutter-y-md">
        <CUnregisteredDeviceListItem
          v-for="device of devices"
          :key="[device.deviceId, device.firmwareVersion].join('/')"
          :device="device"
          data-cy="device"
          :data-device-id="device.deviceId"
          @register-click="register(device)"
        />
      </div>
    </div>

    <q-card
      v-else
      class="page-width q-ma-md flex flex-center"
      flat
      data-cy="empty-ind"
    >
      <div class="column items-center q-gutter-y-sm">
        <div role="heading" aria-level="3" class="text-h5">
          {{ t('registration.list.empty') }}
        </div>
        <q-btn
          color="primary"
          unelevated
          no-caps
          data-cy="refresh-btn"
          @click="fetch"
        >
          {{ t('common.refresh') }}
        </q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import CUnregisteredDeviceListItem from 'components/registration/CUnregisteredDeviceListItem.vue'
import { useUnregisteredListApi } from 'composables/unregistered-list-api.composable'
import { useI18n } from 'vue-i18n'
import { useRegisterDeviceApi } from 'composables/register-device-api.composable'
import { useQuasar } from 'quasar'
import { DeviceIdentifier } from 'src/types/device.interface'
import CRegistrationConfirmDialog from 'components/registration/CRegistrationConfirmDialog.vue'

function useRegisterDevice() {
  const { register } = useRegisterDeviceApi()
  const $q = useQuasar()

  function promptRegister({ deviceId, firmwareVersion }: DeviceIdentifier) {
    $q.dialog({
      component: CRegistrationConfirmDialog,
      componentProps: {
        deviceId,
      },
    }).onOk(async () => {
      $q.loading.show()
      try {
        await register({ deviceId, firmwareVersion })
      } finally {
        $q.loading.hide()
      }
    })
  }

  return {
    register: promptRegister,
  }
}

export default defineComponent({
  components: {
    CUnregisteredDeviceListItem,
  },

  setup() {
    const { devices, fetch, isLoading } = useUnregisteredListApi()
    const { t } = useI18n()

    const { register } = useRegisterDevice()

    onBeforeMount(fetch)

    return {
      devices,
      isLoading,
      fetch,
      t,
      register,
    }
  },
})
</script>
