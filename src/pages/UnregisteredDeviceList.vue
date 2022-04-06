<template>
  <q-page class="row justify-center">
    <div class="page-width" v-if="devices.length">
      <div class="row justify-end">
        <q-btn
          dense
          flat
          round
          icon="refresh"
          :loading="isLoading"
          @click="fetch"
        />
      </div>

      <CUnregisteredDeviceListItem
        v-for="device of devices"
        :key="[device.deviceId, device.firmwareVersion].join('/')"
        :device="device"
        data-cy="device"
        :data-device-id="device.deviceId"
      />
    </div>

    <q-card v-else class="page-width q-ma-md flex flex-center" flat>
      <div class="column items-center q-gutter-y-sm">
        <div role="heading" aria-level="3" class="text-h5">
          {{ t('registration.list.empty') }}
        </div>
        <q-btn color="primary" unelevated no-caps>
          {{ t('common.refresh') }}
        </q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import CUnregisteredDeviceListItem from 'components/registration/CUnregisteredDeviceListItem.vue'
import { useUnregisteredListApi } from 'composables/unregistered-api.composable'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    CUnregisteredDeviceListItem,
  },

  setup() {
    const { devices, fetch, isLoading } = useUnregisteredListApi()
    const { t } = useI18n()

    onBeforeMount(fetch)

    return {
      devices,
      isLoading,
      fetch,
      t,
    }
  },
})
</script>
