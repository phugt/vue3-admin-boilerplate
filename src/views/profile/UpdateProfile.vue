<script setup lang="ts">
import { useAxios } from '@/axios';
import swal from '@/swal';
import $ from 'jquery'
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { api } = useAxios()
const { t } = useI18n()

const modalId = 'modal-' + (Math.random() + 1).toString(36).substring(2)
var modal: any = null
function open() {
    api.get('/profile').then(resp => {
        Object.assign(form, resp.data)
    })
    Object.assign(form, defaultForm)
    formErrors.value = {}
    modal.modal()
}

function close() {
    modal.modal('hide')
}

onMounted(() => {
    modal = $('#' + modalId)
})

defineExpose({ open, close })

const defaultForm = { email: "", full_name: "", address: "", desc: "" }
const form = reactive({ ...defaultForm })
const formErrors = ref<any>({})

const loading = ref(false)

function submit() {
    loading.value = true
    api.post('/profile', form).then(resp => {
        close()
        swal.fire({
            title: t('success'),
            text: t('updateProfileSuccess'),
            icon: "success"
        })
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
    <div :id="modalId" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ $t('updateProfile') }}</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit()">
                        <div class="form-group">
                            <label>{{ $t('email') }}</label>
                            <input v-model.trim="form.email" readonly class="form-control" :placeholder="$t('email')"
                                :class="formErrors['email'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['email'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('fullName') }}</label>
                            <input v-model.trim="form.full_name" class="form-control" :placeholder="$t('fullName')"
                                :class="formErrors['full_name'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['full_name'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('address') }}</label>
                            <input v-model.trim="form.address" class="form-control" :placeholder="$t('address')"
                                :class="formErrors['address'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['address'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('desc') }}</label>
                            <textarea v-model.trim="form.desc" class="form-control"
                                :class="formErrors['desc'] ? 'is-invalid' : ''"></textarea>
                            <div class="invalid-feedback">{{ formErrors['desc'] }}</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-right">
                    <button type="button" class="btn btn-default" @click="close()">
                        {{ $t('cancel') }}
                    </button>
                    <button type="button" :disabled="loading" class="btn btn-primary" @click="submit()">
                        <div v-if="loading" class="spinner-border spinner-border-sm">
                            <span class="sr-only">Loading...</span>
                        </div>
                        {{ $t('submit') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>