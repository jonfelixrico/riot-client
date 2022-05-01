<template>
  <div>
    <CTimeInput
      v-model="startModel"
      :label="t('relay.singleOnInput.start.label')"
      dense
    />
    <CTimeInput
      v-model="endModel"
      :label="t('relay.singleOnInput.end.label')"
      dense
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import CTimeInput from 'components/common/CTimeInput.vue'

export default defineComponent({
  components: {
    CTimeInput,
  },

  props: {
    start: {
      type: String,
      default: undefined,
    },

    end: {
      type: String,
      default: undefined,
    },
  },

  emits: ['update:start', 'update:end'],

  setup(props, { emit }) {
    const startModel = computed<string | undefined>({
      get() {
        return props.start ?? undefined
      },

      set(value) {
        emit('update:start', value)
      },
    })

    const endModel = computed<string | undefined>({
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
