<template>
  <q-page>
    <CDeviceList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CDeviceList from 'components/CDeviceList.vue'

export default defineComponent({
  components: {
    CDeviceList,
  },
})
</script>
