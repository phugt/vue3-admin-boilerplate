<script setup lang="ts">
import { useAxios } from '@/axios'
import $ from 'jquery'
import { ref, reactive, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'
import swal from '@/swal';
import { useI18n } from 'vue-i18n';
const { api } = useAxios()
const { t } = useI18n()

const defaultFilter = { keyword: "", page: 1, pageSize: 50 }
const filter = reactive({ ...defaultFilter })
const listLoading = ref(false)
const loading = ref(false)
const items = ref<any>(null)
const itemCount = ref(0)
const pageCount = ref(0)

function load() {
    listLoading.value = true
    api.get('/user', { data: filter }).then(resp => {
        items.value = resp.data.items
        itemCount.value = resp.data.itemCount
        pageCount.value = resp.data.pageCount
    }).finally(() => {
        listLoading.value = false
    })
}

function page() {
    filter.page++
    load()
}

const defaultForm = { id: null, email: "", password: "", full_name: "", address: "", desc: "" }
const form = reactive({ ...defaultForm })
const formErrors = ref<any>({})

const modalId = 'modal-' + (Math.random() + 1).toString(36).substring(2)
var modal: any = null

function create() {
    Object.assign(form, defaultForm)
    modal.modal()
}

function update(id: any) {
    loading.value = true
    api.get(`/user/${id}`).then(resp => {
        Object.assign(form, resp.data)
        modal.modal()
    }).finally(() => {
        loading.value = false
    })
    Object.assign(form, defaultForm)
    formErrors.value = {}
}

function remove(id: any) {
    swal.fire({
        title: t('warning'),
        text: t('deleteConfirm'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('delete'),
        cancelButtonText: t('cancel')
    }).then((result) => {
        if (result.isConfirmed) {
            loading.value = true
            api.delete(`/user/${id}`).then(resp => {
                swal.fire({
                    title: t('success'),
                    text: t('deleteSuccess'),
                    icon: "success"
                })
                load()
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

function submit() {
    loading.value = true
    api({
        url: `/user`,
        method: form.id ? 'put' : 'post',
        data: filter
    }).then((resp) => {
        modal.modal('hide')
        swal.fire({
            title: t('success'),
            text: t(form.id ? 'updateSuccess' : 'createSuccess'),
            icon: "success"
        })
        load()
    }).catch(resp => {
        if (resp.status == 422) {
            formErrors.value = resp.data
        }
    }).finally(() => {
        loading.value = false
    })
}

onMounted(() => {
    load()
    modal = $('#' + modalId)
})

</script>

<template>
    <div class="content">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>{{ $t('userList') }}</h1>
                    </div>
                    <div class="col-sm-6 align-middle">
                        <div class="float-right">
                            <button class="btn btn-sm btn-success" @click="create()">
                                <i class="fas fa-plus"></i>&nbsp;{{ $t('newUser') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body table-responsive p-0">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>{{ $t('email') }}</th>
                                        <th>{{ $t('full_name') }}</th>
                                        <th>{{ $t('address') }}</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item of items">
                                        <td>{{ item.email }}</td>
                                        <td>{{ item.full_name }}</td>
                                        <td>{{ item.address }}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-xs btn-info" @click="update(item.id)">
                                                    <i class="fa fa-edit"></i>&nbsp;{{ $t('edit') }}
                                                </button>
                                                <button class="btn btn-xs btn-danger" @click="remove(item.id)">
                                                    <i class="fa fa-trash-alt"></i>&nbsp;{{ $t('delete') }}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="card-footer clearfix">
                            <Pagination class="float-right" v-model="filter.page" :item-count="itemCount"
                                :page-count="pageCount" @update="page" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div :id="modalId" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ $t(form.id ? 'newUser' : 'updateUser') }}</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit()">
                        <div class="form-group">
                            <label>{{ $t('email') }}</label>
                            <input v-model.trim="form.email" :readonly="form.id != null" class="form-control"
                                :placeholder="$t('email')" :class="formErrors['email'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['email'] }}</div>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('password') }}</label>
                            <input type="password" v-model.trim="form.password" class="form-control"
                                :placeholder="$t('password')" :class="formErrors['password'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['password'] }}</div>
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
                            <label>{{ $t('userDesc') }}</label>
                            <textarea v-model.trim="form.desc" class="form-control" :placeholder="$t('userDesc')"
                                :class="formErrors['desc'] ? 'is-invalid' : ''"></textarea>
                            <div class="invalid-feedback">{{ formErrors['desc'] }}</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-right">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
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