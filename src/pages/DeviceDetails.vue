<template>
  <q-page class="row justify-center bg-grey-3">
    <div class="content column q-pa-md q-gutter-y-sm">
      <div class="row items-center q-gutter-x-sm">
        <q-btn icon="arrow_back" flat dense round @click="onBackClick" />
      </div>
      <q-card class="col" flat>
        <q-card-content>
          <!-- TODO add content here -->
        </q-card-content>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()

    function onBackClick() {
      router.push({ name: 'device-list' })
    }

    return {
      onBackClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.content {
  body.screen--lg,
  body.screen--md,
  body.screen--xl & {
    width: 1024px;
  }
}
</style>
