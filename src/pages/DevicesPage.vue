<template>
  <q-page>
    <CDeviceList :refDt="now" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CDeviceList from 'components/CDeviceList.vue'
import { useTickingDateTime } from 'src/composables/ticking-datetime.composable'

export default defineComponent({
  components: {
    CDeviceList,
  },

  setup() {
    return {
      ...useTickingDateTime(),
    }
  },
})
</script>
