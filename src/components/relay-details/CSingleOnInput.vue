<template>
  <div>
    <CTimeInput v-model="startModel" />
    <CTimeInput v-model="endModel" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import CTimeInput from './CTimeInput.vue'

export default defineComponent({
  components: {
    CTimeInput,
  },

  props: {
    start: {
      type: String,
      required: true,
    },

    end: {
      type: String,
      required: true,
    },
  },

  emits: ['update:start', 'update:end'],

  setup(props, { emit }) {
    const startModel = computed<string>({
      get() {
        return props.start
      },

      set(value) {
        emit('update:start', value)
      },
    })

    const endModel = computed<string>({
      get() {
        return props.end
      },

      set(value) {
        emit('update:end', value)
      },
    })

    return {
      startModel,
      endModel,
    }
  },
})
</script>
