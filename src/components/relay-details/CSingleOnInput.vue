<template>
  <div>
    <CTimeInput
      v-model="startModel"
      :label="t('relay.singleOnInput.start.label')"
    />
    <CTimeInput
      v-model="endModel"
      :label="t('relay.singleOnInput.end.label')"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
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

    const { t } = useI18n()

    return {
      startModel,
      endModel,
      t,
    }
  },
})
</script>
