<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" :data-cy="dataCy">
      <q-card-section>
        <div role="heading" aria-level="1" v-text="title" class="text-h6" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <slot name="message">
          <div v-text="message" />
        </slot>
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
    /**
     * The label for the title of the dialog
     */
    title: String,

    /**
     * The label for the body of the dialog
     */
    message: String,

    /**
     * Relevant for component testing.
     */
    dataCy: String,

    /**
     * The label of the ok button
     */
    ok: String,
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
