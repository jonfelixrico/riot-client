<template>
  <q-card>
    <q-card-section>
      <div role="heading" :aria-level="headingLevel">
        <span v-if="deviceModule.alias" data-cy="label-alias">
          {{ deviceModule.alias }}
        </span>
        <span v-else data-cy="label-id">{{ deviceModule.moduleId }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DeviceModule } from 'types/device.interface'

export default defineComponent({
  props: {
    deviceModule: {
      type: Object as PropType<DeviceModule>,
      required: true,
    },

    /**
     * Defines the heading level of the main label of the module.
     * This is for a11y purposes.
     */
    headingLevel: {
      type: Number,
      default: 6,
    },
  },
})
</script>
