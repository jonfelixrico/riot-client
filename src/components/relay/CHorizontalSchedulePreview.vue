<template>
  <div>
    <q-resize-observer @resize="onResize" />
    <div class="relative-position" style="height: 40px">
      <div class="absolute">
        <!--
          We can't put these in the same level as QResizeObserver because
          their widths can affect QResizeObserver, which can lead to a self-sustaining
          loop of resizes.
        -->
        <CHorizontalTimeIndicator :now="now" :width="width" :icon-size="30" />
        <CScheduleDisplay
          orientation="horizontal"
          :items="entries"
          :height="10"
          :width="width"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import CScheduleDisplay from './CScheduleDisplay.vue'
import { PresentationScheduleEntry } from './relay-schedule-presentation.utils'
import { DateTime } from 'luxon'
import CHorizontalTimeIndicator from './CHorizontalTimeIndicator.vue'

export default defineComponent({
  components: {
    CScheduleDisplay,
    CHorizontalTimeIndicator,
  },

  props: {
    entries: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
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
