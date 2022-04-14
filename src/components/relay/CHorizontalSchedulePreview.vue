<template>
  <div>
    <q-resize-observer @resize="onResize" />
    <div class="relative-position" :style="rootHeightStyle">
      <!--
        We can't put these two in the same level as QResizeObserver because
        their widths can affect QResizeObserver, which can lead to a self-sustaining
        loop of resizes.
      -->
      <div class="absolute">
        <CHorizontalTimeIndicator
          v-if="now"
          :now="now"
          :width="width"
          :icon-size="iconSize"
        />

        <CScheduleDisplay
          orientation="horizontal"
          :items="entries"
          :height="barSize"
          :width="width"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import CScheduleDisplay from './CScheduleDisplay.vue'
import { PresentationScheduleEntry } from './relay-schedule-presentation.utils'
import { DateTime } from 'luxon'
import CHorizontalTimeIndicator from './CHorizontalTimeIndicator.vue'

const ICON_SIZE = 30
const BAR_SIZE = 10

export default defineComponent({
  components: {
    CScheduleDisplay,
    CHorizontalTimeIndicator,
  },

  props: {
    /**
     * Take note that the entries' timezone is advised to be aligned with
     * the value of `now`.
     */
    entries: {
      type: Array as PropType<PresentationScheduleEntry[]>,
      required: true,
    },

    /**
     * Not providing a value will not show the time indicator.
     */
    now: {
      type: DateTime,
      default: null,
    },
  },

  setup(props) {
    const widthRef = ref(0)
    function onResize({ width }: { width: number }) {
      widthRef.value = width
    }

    const rootHeightStyle = computed(() => {
      let totalHeight = BAR_SIZE
      if (props.now) {
        totalHeight += ICON_SIZE
      }

      return {
        height: `${totalHeight}px`,
      }
    })

    return {
      onResize,
      width: widthRef,
      iconSize: ICON_SIZE,
      barSize: BAR_SIZE,
      rootHeightStyle,
    }
  },
})
</script>
