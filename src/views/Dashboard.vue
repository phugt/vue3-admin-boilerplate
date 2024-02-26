<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

let authStore = useAuthStore()
</script>

<template>
  <main>
    <div class="content">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="card">
          <div class="card-body">
            {{ JSON.stringify(authStore.token) }}
            {{ JSON.stringify(authStore.user) }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
