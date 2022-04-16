<template>
  <q-input v-model="model" filled mask="fulltime" :rules="['fulltime']">
    <template #append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="model" with-seconds format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
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
