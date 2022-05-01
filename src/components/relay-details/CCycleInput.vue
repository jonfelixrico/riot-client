<template>
  <div class="q-gutter-y-md">
    <div class="row items-center q-gutter-x-sm">
      <!-- TODO add i18n -->
      <q-input v-model="onModel" label="On" outlined class="col" />
      <q-radio v-model="firstStateModel" val="ON" />
    </div>

    <div class="row items-center q-gutter-x-sm">
      <!-- TODO add i18n -->
      <q-input v-model="offModel" label="Off" outlined class="col" />
      <q-radio v-model="firstStateModel" val="OFF" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent, PropType } from 'vue'
import type { FirstState } from './composables/cycle-schedule-model.composable'

export default defineComponent({
  props: {
    on: {
      type: Number,
      default: null,
    },

    off: {
      type: Number,
      default: null,
    },

    firstState: {
      type: String as PropType<FirstState>,
      default: 'ON',
    },
  },

  emits: ['update:on', 'update:off', 'update:firstState'],

  setup(props, { emit }) {
    const onModel = computed<number | null>({
      get() {
        return props.on
      },

      set(value) {
        emit('update:on', value)
      },
    })

    const offModel = computed<number | null>({
      get() {
        return props.off
      },

      set(value) {
        emit('update:off', value)
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

    return {
      onModel,
      offModel,
      firstStateModel,
    }
  },
})
</script>
