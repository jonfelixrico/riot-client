<template>
  <div :style="{ height: `${height}px` }" class="relative-position">
    <q-resize-observer @resize="onResize" />
    <div class="absolute" v-if="width">
      <CScheduleDisplay
        orientation="horizontal"
        :items="entries"
        :height="height"
        :width="width"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import CScheduleDisplay from './CScheduleDisplay.vue'
import { PresentationScheduleEntry } from './relay-schedule-presentation.utils'
import { DateTime } from 'luxon'

export default defineComponent({
  components: {
    CScheduleDisplay,
  },

  props: {
    entries: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
    },

    height: {
      type: Number,
      default: 10,
    },

    now: {
      type: DateTime,
      required: true,
    },
  },

  setup() {
    const widthRef = ref(0)
    function onResize({ width }: { width: number }) {
      widthRef.value = width
    }

    return {
      onResize,
      width: widthRef,
    }
  },
})
</script>
