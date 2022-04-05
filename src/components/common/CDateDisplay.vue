<template>
  <span v-if="relative">
    <span class="cursor-pointer text-underline-dotted">{{ relative }}</span>
    <q-tooltip>{{ absolute }}</q-tooltip>
  </span>

  <span v-else>
    {{ absolute }}
  </span>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { DateTime } from 'luxon'
import { useStaticDateTime } from 'src/composables/static-datetime.composable'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    date: {
      type: DateTime,
      required: true,
    },
  },

  setup(props) {
    const now = useStaticDateTime()

    const relative = computed(() => {
      if (!props.date.hasSame(now, 'day')) {
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
