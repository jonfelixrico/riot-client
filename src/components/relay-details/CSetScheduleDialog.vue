<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6" role="heading" aria-level="1">
          {{ t('relay.dialogs.setSchedule.title') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <CSingleOnInput
          v-if="type === 'SINGLE_ON'"
          v-model:start="singleOnModel.start"
          v-model:end="singleOnModel.end"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          no-caps
          unelevated
          dense
          :label="t('relay.dialogs.setSchedule.ok')"
          @click="onOk"
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

<script lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useSetScheduleStore } from 'src/stores/set-schedule-store'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CSingleOnInput from './CSingleOnInput.vue'

type SetScheduleType = 'CYCLE' | 'SINGLE_ON'

function useSingleOnModel() {
  const { singleOn, setSingleOnSchedule } = useSetScheduleStore()
  const start = computed<string>({
    get() {
      return singleOn.start ?? ''
    },

    set(start) {
      setSingleOnSchedule({ start })
    },
  })

  const end = computed<string>({
    get() {
      return singleOn.end ?? ''
    },

    set(end) {
      setSingleOnSchedule({ end })
    },
  })

  return reactive({
    start,
    end,
  })
}

export default {
  components: {
    CSingleOnInput,
  },
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { t } = useI18n()

    const store = useSetScheduleStore()
    const singleOnModel = useSingleOnModel()

    const type = ref<SetScheduleType[keyof SetScheduleType]>('SINGLE_ON')

    const reducedResult = computed(() => {
      switch (type.value) {
        case 'CYCLE': {
          // TODO return getter
          return null
        }

        case 'SINGLE_ON': {
          return store.singleOnSchedule
        }

        default: {
          return null
        }
      }
    })

    // TODO maybe its better to use a QForm?
    function onOk() {
      if (!reducedResult.value) {
        return
      }

      onDialogOK(reducedResult.value)
    }

    return {
      dialogRef,
      onDialogHide,
      onOk,
      onDialogCancel,
      t,
      singleOnModel,
      type,
    }
  },
}
</script>
