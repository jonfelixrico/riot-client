<template>
  <div>
    <div class="row items-center q-gutter-x-sm">
      <div
        role="heading"
        :aria-level="headingLevel"
        data-cy="label-container"
        class="text-h6"
      >
        <span v-if="deviceModule.alias" data-cy="label-alias">
          {{ deviceModule.alias }}
        </span>
        <span v-else data-cy="label-id">{{ deviceModule.moduleId }}</span>
      </div>

      <q-badge data-cy="type">{{ deviceModule.type }}</q-badge>
    </div>

    <div
      v-if="deviceModule.alias"
      data-cy="module-id"
      class="text-caption text-grey-7"
    >
      {{ deviceModule.moduleId }}
    </div>
  </div>
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
