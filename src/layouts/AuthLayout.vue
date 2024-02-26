<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({
    bodyAttrs: {
        class: () => {
            return 'hold-transition login-page';
        },
    },
});

</script>

<template>
    <RouterView />
</template>