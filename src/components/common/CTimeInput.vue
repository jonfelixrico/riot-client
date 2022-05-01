<template>
  <q-input
    v-model="model"
    readonly
    outlined
    mask="fulltime"
    :rules="['fulltime']"
    :label="label"
    :hint="hint"
    :dense="dense"
  >
    <template #append>
      <q-btn icon="access_time" round dense unelevated color="primary">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="model" with-seconds format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-btn>
    </template>
  </q-input>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: null,
    },

    label: {
      type: String,
      default: undefined,
    },

    hint: {
      type: String,
      default: undefined,
    },

    dense: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const model = computed<string | null>({
      get() {
        return props.modelValue
      },

      set(value) {
        emit('update:modelValue', value)
      },
    })

    return {
      model,
    }
  },
})
</script>
