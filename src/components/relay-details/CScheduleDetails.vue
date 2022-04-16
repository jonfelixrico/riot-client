<template>
  <q-expansion-item>
    <template #header>
      <div
        :style="{ height: `${SCHEDULE_BAR_HEIGHT}px` }"
        class="relative-position"
      >
        <q-resize-observer @resize="onResize" />
        <div class="absolute">
          <CScheduleDisplay
            :items="modelValue"
            :height="SCHEDULE_BAR_HEIGHT"
            :width="width"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div class="row">
        <div class="col">
          <!-- list of schedule goes here -->
        </div>
        <div>
          <!-- edit button goes here -->
        </div>
      </div>
    </template>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { PresentationScheduleEntry } from '../relay/relay-schedule-presentation.utils'
import CScheduleDisplay from 'components/relay/CScheduleDisplay.vue'

export default defineComponent({
  components: {
    CScheduleDisplay,
  },

  props: {
    modelValue: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const width = ref(0)
    function onResize(value: { width: number }) {
      width.value = value.width
    }

    return {
      width,
      onResize,
      SCHEDULE_BAR_HEIGHT: 10,
    }
  },
})
</script>
