<template>
  <q-page class="page-width q-mx-auto">
    <CUnregisteredDeviceListItem
      v-for="device of devices"
      :key="[device.deviceId, device.firmwareVersion].join('/')"
      :device="device"
      data-cy="device"
      :data-device-id="device.deviceId"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CUnregisteredDeviceListItem from 'components/registration/CUnregisteredDeviceListItem.vue'
import { useUnregisteredListApi } from 'composables/unregistered-api.composable'

export default defineComponent({
  components: {
    CUnregisteredDeviceListItem,
  },

  setup() {
    const { devices } = useUnregisteredListApi()
    return { devices }
  },
})
</script>
