<script setup lang="ts">
import LanguageSelector from "@/components/LanguageSelector.vue"
import UpdateProfile from "@/views/profile/UpdateProfile.vue"
import ChangePassword from "@/views/profile/ChangePassword.vue"
import { useHead } from "@unhead/vue"
import { ref, onMounted, reactive, computed, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { vOnClickOutside } from '@vueuse/components'
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { useAxios } from "@/axios";
const { api } = useAxios()

const items = reactive<any>([
    { label: 'dashboard', icon: 'fa-tachometer-alt', to: '/' },
    {
        label: 'reports',
        icon: 'fa-chart-line',
        items: [
            { label: 'powerBankStation', to: '/report/power-bank' }
        ]
    },
    {
        label: 'devices',
        icon: 'fa-vector-square',
        items: [
            { label: 'powerBankStation', to: '/power-bank-station' }
        ]
    },
    {
        label: 'users',
        icon: 'fa-users',
        items: [
            { label: 'users', to: '/users' },
            { label: 'administrators', to: '/admins' },
        ]
    },
])

const sidebarCollapse = ref(false)
const sidebarOpen = ref(false)

function menuClick(item: any) {
    if (item.class != null) {
        item.class = null
    } else {
        item.class = 'menu-open'
    }
}

function sidebarClick() {
    if (window.innerWidth >= 768) {
        sidebarCollapse.value = !sidebarCollapse.value
    } else {
        sidebarCollapse.value = false
        sidebarOpen.value = !sidebarOpen.value
    }
}

function sidebarOutsideClick() {
    sidebarOpen.value = false
}

function onResize() {
    sidebarCollapse.value = (window.innerWidth < 1200)
}

function logout() {
    useAuthStore().logout()
    router.push('/login')
}

const updateProfile = ref<any>(null)
function openUpdateProfile() {
    updateProfile.value.open()
}

const changePassword = ref<any>(null)
function openChangePassword() {
    changePassword.value.open()
}

useHead({
    bodyAttrs: {
        class: computed(() => {
            let classes = ['layout-fixed', 'sidebar-mini']
            if (sidebarCollapse.value) {
                classes.push('sidebar-collapse')
            } else if (sidebarOpen.value) {
                classes.push('sidebar-open')
            }
            return classes;
        })
    },
})

onMounted(() => {
    window.addEventListener('resize', onResize)
    items.forEach((item: any) => {
        if (item.items) {
            item.items.forEach((i: any) => {
                if (i.to == useRoute().path) {
                    item.class = 'menu-open'
                }
            })
        }
    })
    onResize()
    if (!useAuthStore().user) {
        api.defaults.headers.common["Authorization"] = "Bearer " + useAuthStore().token
        api.get('/profile').then(resp => {
            useAuthStore().user = resp.data
        })
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', onResize)
})

</script>

<template>
    <div class="wrapper">
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link cursor-pointer" @click="sidebarClick" v-on-click-outside="sidebarOutsideClick">
                        <i class="fas fa-bars"></i>
                    </a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown"
                        aria-expanded="false"><i class="far fa-user"></i>&nbsp;{{ useAuthStore().user?.full_name }}
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                        <a class="dropdown-item cursor-pointer" @click="openUpdateProfile()">{{ $t('updateProfile')
                        }}</a>
                        <a class="dropdown-item cursor-pointer" @click="openChangePassword()">{{ $t('changePassword') }}</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item cursor-pointer" @click="logout()">{{ $t('logout') }}</a>
                    </div>
                </li>
            </ul>
        </nav>
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <RouterLink to="/" class="brand-link text-center">
                <span class="h3 font-weight-light">Any<b class="brand-text">Share</b></span>
            </RouterLink>
            <div class="sidebar">
                <div class="form-inline mt-3">
                    <div class="input-group" data-widget="sidebar-search">
                        <input class="form-control form-control-sidebar" type="search" placeholder="Search"
                            aria-label="Search">
                        <div class="input-group-append">
                            <button class="btn btn-sidebar">
                                <i class="fas fa-search fa-fw"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column">
                        <li class="nav-item" v-for="item of items" :class="item.class">
                            <component :is="item.to?RouterLink:'a'" :to="item.to" class="nav-link cursor-pointer"
                                @click="menuClick(item)" :class="useRoute().path == item.to ? 'active' : null">
                                <i v-if="item.icon" class="nav-icon fas" :class="item.icon"></i>
                                <p>
                                    {{ $t(item.label) }}
                                    <i v-if="item.items" class="fas fa-angle-left right"></i>
                                </p>
                            </component>
                            <ul v-if="item.items" class="nav nav-treeview">
                                <li v-for="sub of item.items" class="nav-item">
                                    <RouterLink :to="sub.to" class="nav-link"
                                        :class="useRoute().path == sub.to ? 'active' : null">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>{{ $t(sub.label) }}</p>
                                    </RouterLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>

        <div class="content-wrapper">
            <RouterView />
        </div>

        <UpdateProfile ref="updateProfile" />
        <ChangePassword ref="changePassword" />
        <footer class="main-footer">
            <div class="float-right d-none d-sm-block">
                <LanguageSelector />
            </div>
            <strong>Copyright &copy; 2024 <a target="_blank" href="https://anyshare.pro">AnyShare.pro</a>.</strong>
            &nbsp;All rights reserved.
        </footer>
    </div>
</template>