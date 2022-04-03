<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>RIOT Project</q-toolbar-title>

        <div>Client v{{ version }}</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view class="bg-grey-3" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      version: process.env.FE_VERSION,
    }
  },
})
</script>
