<template>
  <div class="q-gutter-y-md">
    <div class="q-gutter-y-sm">
      <q-input
        v-model.number="onModel"
        type="number"
        :label="t('relay.cyclicalInput.on.label')"
        outlined
        class="col"
        :hint="t('relay.cyclicalInput.on.hint')"
        dense
      />

      <q-input
        v-model.number="offModel"
        type="number"
        :label="t('relay.cyclicalInput.off.label')"
        outlined
        class="col"
        :hint="t('relay.cyclicalInput.off.hint')"
        dense
      />
    </div>

    <q-separator />

    <div class="column">
      <q-radio
        v-model="firstStateModel"
        val="ON"
        :label="t('relay.cyclicalInput.firstState.on.label')"
      />
      <q-radio
        v-model="firstStateModel"
        val="OFF"
        :label="t('relay.cyclicalInput.firstState.off.label')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FirstState } from './cycle-schedule-model.composable'

export default defineComponent({
  props: {
    on: {
      type: Number,
      default: undefined,
    },

    off: {
      type: Number,
      default: undefined,
    },

    firstState: {
      type: String as PropType<FirstState>,
      default: 'ON',
    },
  },

  emits: ['update:on', 'update:off', 'update:firstState'],

  setup(props, { emit }) {
    // NOTE: the model uses seconds, but we want the input to use minutes

    const onModel = computed<number | undefined>({
      get() {
        return props.on && props.on / 60
      },

      set(value) {
        emit('update:on', value && value * 60)
      },
    })

    const offModel = computed<number | undefined>({
      get() {
        return props.off && props.off / 60
      },

      set(value) {
        emit('update:off', value && value * 60)
      },
    })

    const firstStateModel = computed<FirstState>({
      get() {
        return props.firstState
      },

      set(value) {
        emit('update:firstState', value)
      },
    })

    const { t } = useI18n()

    return {
      onModel,
      offModel,
      firstStateModel,
      t,
    }
  },
})
</script>
