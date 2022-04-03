<template>
  <q-card>
    <q-card-section>
      <div role="heading" :aria-level="headingLevel">
        <span v-if="device.alias" data-cy="label-alias">
          {{ device.alias }}
        </span>
        <span v-else data-cy="label-id">{{ device.moduleId }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DeviceModule } from 'types/device.interface'

export default defineComponent({
  props: {
    device: {
      type: Object as PropType<DeviceModule>,
      required: true,
    },

    headingLevel: {
      type: Number,
      default: 6,
    },
  },
})
</script>
