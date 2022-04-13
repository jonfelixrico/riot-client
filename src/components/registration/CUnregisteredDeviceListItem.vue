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
                <CDateDisplay :date="device.lastQueueDt" :ref-dt="now" />
              </template>
            </i18n-t>
          </span>
        </div>
      </div>

      <q-btn
        data-cy="register-btn"
        no-caps
        color="primary"
        unelevated
        @click="$emit('register-click')"
      >
        {{ t('registration.register') }}
      </q-btn>
    </q-card-section>

    <template v-if="device.modules.length">
      <q-separator />

      <q-card-section class="row q-gutter-x-sm q-py-xs">
        <q-chip
          v-for="{ type, count } of groupedModules"
          :key="type"
          square
          dense
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
import { useStaticDateTime } from 'src/composables/static-datetime.composable'

export default defineComponent({

  components: { CDateDisplay },
  emits: ['register-click'],

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

    const now = useStaticDateTime()

    return {
      t,
      groupedModules,
      now,
    }
  },
})
</script>
