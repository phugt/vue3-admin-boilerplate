import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createHead } from "@unhead/vue"
import router from './router'
import { useAuthStore } from './stores/auth'

import App from './App.vue'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import en from '@/i18n/en.json'
import vi from '@/i18n/vi.json'

const app = createApp(App)
app.component('AuthLayout', AuthLayout)
app.component('DefaultLayout', DefaultLayout)

app.use(createPinia())
app.use(createHead())
app.use(createI18n({
    locale: localStorage?.getItem("locale") ?? 'en',
    fallbackLocale: 'en',
    legacy: false,
    messages: { en, vi }
}))

const authStore = useAuthStore()

if (localStorage?.getItem("token")) {
    authStore.token = localStorage.getItem("token")
}

router.beforeEach(async (to) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !authStore.token) {
        return '/login';
    }
});

app.use(router)

router.isReady().then(() => {
    app.mount('#app')
})
