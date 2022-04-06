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

    <CEmptyUnregisteredDeviceListVue v-else class="page-width q-ma-md" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import CUnregisteredDeviceListItem from 'components/registration/CUnregisteredDeviceListItem.vue'
import { useUnregisteredListApi } from 'composables/unregistered-api.composable'
import CEmptyUnregisteredDeviceListVue from 'components/registration/CEmptyUnregisteredDeviceList.vue'

export default defineComponent({
  components: {
    CUnregisteredDeviceListItem,
    CEmptyUnregisteredDeviceListVue,
  },

  setup() {
    const { devices, fetch, isLoading } = useUnregisteredListApi()

    onBeforeMount(fetch)

    return {
      devices,
      isLoading,
      fetch,
    }
  },
})
</script>
