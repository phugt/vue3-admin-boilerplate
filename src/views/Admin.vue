<script setup lang="ts">
import { useAxios } from '@/axios'
import $ from 'jquery'
import { ref, reactive, onMounted } from 'vue'
import Pagination from '@/components/Pagination.vue'
import swal from '@/swal';
import { useI18n } from 'vue-i18n';
import TabBar from '@/components/TabBar.vue';
import UserSelect from '@/components/UserSelect.vue';
const { api } = useAxios()
const { t } = useI18n()

const defaultFilter = { status: "all", keyword: "", page: 1, pageSize: 50 }
const filter = reactive({ ...defaultFilter })
const listLoading = ref(false)
const loading = ref(false)
const items = ref<any>(null)
const itemCount = ref(0)
const pageCount = ref(0)

function load() {
    listLoading.value = true
    api.get('/admin', { params: filter }).then(resp => {
        items.value = resp.data.items
        itemCount.value = resp.data.itemCount
        pageCount.value = resp.data.pageCount
    }).finally(() => {
        listLoading.value = false
    })
}

function search() {
    filter.page = 1
    load()
}

const defaultForm = { id: null, userId: "", roles: []}
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
    api.get(`/admin/${id}`).then(resp => {
        Object.assign(form, resp.data)
    }).finally(() => {
        loading.value = false
        modal.modal()
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
            api.delete(`/admin/${id}`).then(resp => {
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
        url: `/admin`,
        method: form.id ? 'put' : 'post',
        data: form
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
                        <h1>{{ $t('adminList') }}</h1>
                    </div>
                    <div class="col-sm-6 align-middle">
                        <div class="float-right">
                            <button class="btn btn-sm btn-success" @click="create()">
                                <i class="fas fa-plus"></i>&nbsp;{{ $t('create') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <TabBar v-model="filter.status" @update:model-value="search"
                        :tabs="[{ label: $t('all'), value: 'all' }, { label: $t('deleted'), value: 'deleted' }]" />
                    <div class="card">
                        <div class="card-body">
                            <form @submit.prevent="load()" class="form-inline">
                                <div class="form-group my-2">
                                    <input v-model="filter.keyword" class="form-control"
                                        :placeholder="$t('searchPlaceholder')">
                                </div>
                                <button type="submit" class="btn btn-primary mx-2 my-2">{{ $t('search') }}</button>
                            </form>
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
                                        <th>{{ $t('fullName') }}</th>
                                        <th>{{ $t('roles') }}</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item of items">
                                        <td>{{ item.user.email }}</td>
                                        <td>{{ item.user.fullName }}</td>
                                        <td>{{ item.roles }}</td>
                                        <td>
                                            <div class="btn-group" v-if="!item.deleteTime">
                                                <button class="btn btn-xs btn-info" @click="update(item.id)">
                                                    <i class="fa fa-edit"></i>&nbsp;{{ $t('edit') }}
                                                </button>
                                                <button class="btn btn-xs btn-danger" @click="remove(item.id)">
                                                    <i class="fa fa-trash-alt"></i>&nbsp;{{ $t('delete') }}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="(!items || items.length == 0)">
                                        <td colspan="4" class="text-center">
                                            <div v-if="listLoading" class="spinner-border spinner-border-sm">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <div v-else>
                                                <span class="text-danger">{{ $t('noResult') }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="card-footer clearfix">
                            <Pagination class="float-right" v-model="filter.page" :item-count="itemCount"
                                :page-count="pageCount" @update:model-value="load()" />
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
                    <h4 class="modal-title">{{ $t(form.id ? 'updateAdmin' : 'newAdmin') }}</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submit()">
                        <UserSelect v-model="form.userId" :readonly="form.id != null" :error="formErrors['userId']"/>
                        <div class="form-group">
                            <label>{{ $t('roles') }}</label>
                            <input v-model.trim="form.roles" class="form-control" :placeholder="$t('roles')"
                                :class="formErrors['roles'] ? 'is-invalid' : ''">
                            <div class="invalid-feedback">{{ formErrors['roles'] }}</div>
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