<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAxios } from '@/axios'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
const { api } = useAxios()
const authStore = useAuthStore()

const form = reactive({ email: "", password: "" })
const formErrors = ref<any>({})

const loading = ref(false)

function submit() {
    loading.value = true
    api.post('/login', form).then(resp => {
        formErrors.value = {}
        authStore.login(resp.data.token, resp.data.user)
        router.push('/')
    }).catch(resp => {
        if (resp.status == 422) {
            formErrors.value = resp.data
        }
    }).finally(() => {
        loading.value = false
    })
}
</script>

<template>
    <div class="login-box">
        <div class="card card-outline card-primary">
            <div class="card-header text-center">
                <RouterLink to="/login" class="h1">Any<b>Share</b></RouterLink>
            </div>
            <div class="card-body">
                <p class="login-box-msg">{{ $t('signinLabel') }}</p>
                <form @submit.prevent="submit">
                    <div class="input-group mb-3">
                        <input v-model.trim="form.email" type="text" class="form-control" :placeholder="$t('email')"
                            :class="formErrors['email'] ? 'is-invalid' : ''">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                        <div class="invalid-feedback">{{ formErrors['email'] }}</div>
                    </div>
                    <div class="input-group mb-3">
                        <input v-model.trim="form.password" type="password" class="form-control"
                            :placeholder="$t('password')" :class="formErrors['password'] ? 'is-invalid' : ''">
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                        <div class="invalid-feedback">{{ formErrors['password'] }}</div>
                    </div>
                    <div class="text-center mt-2 mb-3">
                        <button :disabled="loading" type="submit" class="btn btn-primary btn-block">
                            <div v-if="loading" class="spinner-border spinner-border-sm">
                                <span class="sr-only">Loading...</span>
                            </div>
                            {{ $t('signin') }}
                        </button>
                    </div>
                </form>
                <p class="mb-0">
                    <RouterLink to="/forgot-password">{{ $t('forgotMyPassword') }}</RouterLink>
                </p>
            </div>
            <div class="card-footer text-center">
                <LanguageSelector />
            </div>
        </div>
    </div>
</template>