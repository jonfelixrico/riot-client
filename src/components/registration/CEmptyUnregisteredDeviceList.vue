<template>
  <q-card class="flex flex-center" flat>
    <div class="column items-center q-gutter-y-sm">
      <div role="heading" aria-level="3" class="text-h5">
        {{ t('registration.list.empty') }}
      </div>
      <q-btn color="primary" unelevated no-caps>
        {{ t('common.refresh') }}
      </q-btn>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  emits: ['refresh'],
  setup() {
    const { t } = useI18n()
    return { t }
  },
})
</script>
