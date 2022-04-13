<template>
  <div :style="{ height: `${height}px` }" class="relative-position">
    <q-resize-observer @resize="onResize" />
    <div class="absolute" v-if="width">
      <CScheduleDisplay
        orientation="horizontal"
        :items="transformed"
        :height="height"
        :width="width"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue'
import { ScheduleEntry } from 'types/relay-config.interface'
import CScheduleDisplay from './CScheduleDisplay.vue'
import { processScheduleEntries } from 'src/utils/relay-schedule.utils'
import { prepareScheduleEntryWithDateTimeForPresentation } from './relay-schedule-presentation.utils'
import { DateTime } from 'luxon'

export default defineComponent({
  components: {
    CScheduleDisplay,
  },

  props: {
    scheduleEntries: {
      type: Array as PropType<ScheduleEntry[]>,
      required: true,
    },

    originalUtcOffset: {
      type: String,
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

  setup(props) {
    const transformed = computed(() => {
      const { originalUtcOffset, scheduleEntries } = props
      const processed = processScheduleEntries(
        scheduleEntries,
        originalUtcOffset
      )

      return prepareScheduleEntryWithDateTimeForPresentation(processed)
    })

    const widthRef = ref(0)
    function onResize({ width }: { width: number }) {
      widthRef.value = width
    }

    return {
      transformed,
      onResize,
      width: widthRef,
    }
  },
})
</script>
