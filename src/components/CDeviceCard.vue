<template>
  <q-card>
    <q-card-section class="column">
      <div class="row items-center q-gutter-x-sm">
        <div class="text-h6">
          <h5 v-if="device.alias" class="q-my-none" data-cy="alias">
            {{ device.alias }}
          </h5>
          <h5 v-else data-cy="no-alias">No Alias</h5>
        </div>

        <q-badge data-cy="online-ind" color="green">ONLINE</q-badge>
      </div>

      <div class="row q-gutter-x-sm">
        <div class="text-caption text-grey-7" data-cy="device-id">
          {{ device.deviceId }}
        </div>

        <q-separator vertical />

        <div class="text-caption text-grey-7" data-cy="version">
          v{{ device.firmwareVersion }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Device } from 'src/types/device.interface'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    device: {
      required: true,
      type: Object as PropType<Device>,
    },
  },
})
</script>
