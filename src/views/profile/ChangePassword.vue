<script setup lang="ts">
import { useAxios } from '@/axios'
import swal from '@/swal';
import $ from 'jquery'
import { reactive } from 'vue';
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
const { api } = useAxios()
const { t } = useI18n()

const modalId = 'modal-' + (Math.random() + 1).toString(36).substring(2)
var modal: any = null

function open() {
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

const defaultForm = { oldPassword: "", newPassword: "", rePassword: "" }
const form = reactive({ ...defaultForm })
const formErrors = ref<any>({})

const loading = ref(false)

function submit() {
    loading.value = true
    api.post('/profile/password', form).then(resp => {
        close()
        swal.fire({
            title: t('success'),
            text: t('changePasswordSuccess'),
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
                    <h4 class="modal-title">{{ $t('changePassword') }}</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit()">
                        <div class="form-group">
                            <label>{{ $t('oldPassword') }}</label>
                            <input type="password" v-model.trim="form.oldPassword" class="form-control"
                                :placeholder="$t('oldPassword')" :class="formErrors['oldPassword'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['oldPassword'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('newPassword') }}</label>
                            <input type="password" v-model.trim="form.newPassword" class="form-control"
                                :placeholder="$t('newPassword')" :class="formErrors['newPassword'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['newPassword'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('rePassword') }}</label>
                            <input type="password" v-model.trim="form.rePassword" class="form-control"
                                :placeholder="$t('rePassword')" :class="formErrors['rePassword'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['rePassword'] }}</div>
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