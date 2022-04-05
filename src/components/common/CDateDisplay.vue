<template>
  <span v-if="relative" data-cy="relative">
    <span class="cursor-pointer text-underline-dotted">{{ relative }}</span>
    <q-tooltip data-cy="absolute-tooltip">{{ absolute }}</q-tooltip>
  </span>

  <span v-else data-cy="absolute">
    {{ absolute }}
  </span>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { DateTime } from 'luxon'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    date: {
      type: DateTime,
      required: true,
    },

    refDt: {
      type: DateTime,
      default: () => DateTime.now(),
    },
  },

  setup(props) {
    const relative = computed(() => {
      if (!props.date.hasSame(props.refDt, 'day')) {
        return null
      }

      return props.date.toLocaleString(DateTime.TIME_WITH_SECONDS)
    })

    const absolute = computed(() =>
      props.date.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
    )

    return {
      relative,
      absolute,
    }
  },
})
</script>
