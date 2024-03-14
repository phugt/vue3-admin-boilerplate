<script setup lang="ts">
import { useAxios } from '@/axios'
const { api } = useAxios()
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

const switchLang = (lang: string) => {
    i18n.locale.value = lang
    api.defaults.headers.common["Accept-Language"] = lang
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("locale", lang)
    }
};
</script>

<template>
    <a @click="switchLang('en')" class="cursor-pointer">English</a>&nbsp;|&nbsp;
    <a @click="switchLang('vi')" class="cursor-pointer">Tiếng Việt</a>
</template>