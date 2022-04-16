<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-actions align="right">
        <q-btn
          color="primary"
          no-caps
          unelevated
          dense
          :label="t('common.ok')"
          @click="onDialogOK"
        />
        <q-btn
          no-caps
          flat
          dense
          :label="t('common.cancel')"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { useI18n } from 'vue-i18n'

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const { t } = useI18n()

    return {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel,
      t,
    }
  },
}
</script>
