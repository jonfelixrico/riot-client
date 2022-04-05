<template>
  <q-card>
    <q-card-section class="row items-center">
      <div class="col">
        <div role="heading" aria-level="6" class="text-h6" data-cy="device-id">
          {{ device.deviceId }}
        </div>
        <div class="row q-gutter-x-sm">
          <span class="text-caption text-grey-7" data-cy="version">
            {{ t('common.version', { version: device.firmwareVersion }) }}
          </span>

          <q-separator vertical />

          <span class="text-caption text-grey-7" data-cy="last-activity">
            <i18n-t keypath="registration.lastActivity">
              <template #date>
                <CDateDisplay :date="device.lastQueueDt" />
              </template>
            </i18n-t>
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
    </q-card-section>

    <template v-if="device.modules.length">
      <q-separator />

      <q-card-section class="row q-gutter-x-sm q-py-xs">
        <q-chip
          square
          dense
          v-for="{ type, count } of groupedModules"
          :key="type"
          data-cy="module-group"
          :data-type="type"
        >
          <q-avatar color="primary" text-color="white">{{ count }}</q-avatar>
          <span>{{ type }}</span>
        </q-chip>
      </q-card-section>
    </template>
  </q-card>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { countBy, entries, orderBy } from 'lodash'
import { UnregisteredDevice } from 'src/types/unregistered-device.interface'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import CDateDisplay from 'components/common/CDateDisplay.vue'

export default defineComponent({
  emits: ['register-click'],

  components: { CDateDisplay },

  props: {
    device: {
      required: true,
      type: Object as PropType<UnregisteredDevice>,
    },
  },

  setup(props) {
    const { t } = useI18n()

    const groupedModules = computed(() => {
      const groups = countBy(props.device.modules, 'type')
      const asArr = entries(groups).map(([type, count]) => ({
        type,
        count,
      }))

      return orderBy(asArr, ['count', 'type'], ['desc', 'asc'])
    })

    return {
      t,
      groupedModules,
    }
  },
})
</script>
