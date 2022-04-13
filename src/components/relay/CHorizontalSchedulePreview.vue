<template>
  <div>
    <div
      :style="{
        height: `${ICON_SIZE}px`,
      }"
      class="relative-position"
    >
      <div
        :style="[
          {
            height: `${ICON_SIZE}px`,
          },
          nowIndicatorStyles,
        ]"
        class="absolute"
      >
        <q-icon name="place" :size="`${ICON_SIZE}px`" />
      </div>
    </div>
    <div style="height: 10px" class="relative-position">
      <q-resize-observer @resize="onResize" />
      <div class="absolute" v-if="width">
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
import { defineComponent, PropType, ref, computed } from 'vue'
import CScheduleDisplay from './CScheduleDisplay.vue'
import {
  convertDateTimeToSeconds,
  PresentationScheduleEntry,
} from './relay-schedule-presentation.utils'
import { DateTime } from 'luxon'
import { MAX_SECONDS } from './relay.constants'
import { round } from 'lodash'

const ICON_SIZE = 30

export default defineComponent({
  components: {
    CScheduleDisplay,
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

  setup(props) {
    const widthRef = ref(0)
    function onResize({ width }: { width: number }) {
      widthRef.value = width
    }

    const nowIndicatorStyles = computed(() => {
      const leftOffset = ICON_SIZE / 2
      const left =
        (convertDateTimeToSeconds(props.now) / MAX_SECONDS) * widthRef.value
      return {
        left: `${round(left) - leftOffset}px`,
      }
    })

    return {
      onResize,
      width: widthRef,
      nowIndicatorStyles,
      ICON_SIZE,
    }
  },
})
</script>
