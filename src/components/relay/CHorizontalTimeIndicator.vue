<template>
  <div
    :style="{
      height: `${iconSize}px`,
    }"
    class="relative-position"
  >
    <div
      :style="[
        {
          height: `${iconSize}px`,
        },
        positionStyle,
      ]"
      class="absolute"
    >
      <q-icon name="place" :size="`${iconSize}px`" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { round } from 'lodash'
import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import { convertDateTimeToSeconds } from './relay-schedule-presentation.utils'
import { MAX_SECONDS } from './relay.constants'

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 300,
    },

    now: {
      type: DateTime,
      required: true,
    },

    iconSize: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const positionStyle = computed(() => {
      const leftOffset = props.iconSize / 2
      const left =
        (convertDateTimeToSeconds(props.now) / MAX_SECONDS) * props.width
      return {
        left: `${round(left) - leftOffset}px`,
      }
    })

    return {
      positionStyle,
    }
  },
})
</script>
