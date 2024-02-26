<script setup lang="ts">
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => {
  const layout = route?.meta?.layout;
  if (layout) {
    return `${layout}Layout`
  }
  return 'DefaultLayout';
})

</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback');
@import '@fortawesome/fontawesome-free/css/all.css';
@import 'admin-lte/dist/css/adminlte.css';

.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <component :is="layout" />
</template>