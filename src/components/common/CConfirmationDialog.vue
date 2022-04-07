<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" :data-cy="dataCy">
      <q-card-section>
        <div role="heading" aria-level="1" v-text="title" class="text-h6" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-text="message" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          no-caps
          :label="ok ?? t('common.ok')"
          @click="onOKClick"
          data-cy="ok"
        />
        <q-btn
          flat
          no-caps
          :label="cancel ?? t('common.cancel')"
          @click="onCancelClick"
          data-cy="cancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    title: String,
    message: String,
    dataCy: String,
    ok: String,
    cancel: String,
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { t } = useI18n()

    return {
      dialogRef,
      onDialogHide,
      onOKClick: onDialogOK,
      onCancelClick: onDialogCancel,
      t,
    }
  },
})
</script>
