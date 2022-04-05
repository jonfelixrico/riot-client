<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div
            role="heading"
            aria-level="6"
            class="text-h6"
            data-cy="device-id"
          >
            {{ device.deviceId }}
          </div>
          <div class="row q-gutter-x-sm">
            <span class="text-caption text-grey-7" data-cy="version">
              {{ t('common.version', { version: device.firmwareVersion }) }}
            </span>

            <q-separator vertical />

            <span class="text-caption text-grey-7" data-cy="last-activity">
              <!-- TODO use actual date formatting here -->
              {{ t('registration.lastActivity', { date: 'PLACEHOLDER' }) }}
            </span>
          </div>
        </div>

        <q-btn
          data-cy="register-btn"
          no-caps
          @click="$emit('register-click')"
          color="primary"
          unelevated
        >
          {{ t('registration.register') }}
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  emits: ['register-click'],

  props: {
    device: {
      required: true,
      type: Object as PropType<UnregisteredDevice>,
    },
  },

  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
})
</script>
