<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" data-cy="register-confirm">
      <q-card-section>
        <div role="heading" aria-level="1" class="text-h6">
          {{ t('registration.dialogs.confirm.title') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <i18n-t keypath="registration.dialogs.confirm.message">
          <template #deviceId>
            <span class="text-weight-bold">{{ deviceId }}</span>
          </template>
        </i18n-t>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          unelevated
          no-caps
          :label="ok ?? t('registration.dialogs.confirm.ok')"
          data-cy="ok"
          @click="onOKClick"
        />
        <q-btn
          flat
          no-caps
          :label="cancel ?? t('registration.dialogs.confirm.cancel')"
          data-cy="cancel"
          @click="onCancelClick"
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
    deviceId: String,
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
