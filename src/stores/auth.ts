import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<any>(null)
  const user = ref<any>(null)

  function login(t: any, u: any) {
    token.value = t
    user.value = u
    if (localStorage) {
      localStorage.setItem('token', t)
    }
  }
  function logout() {
    token.value = null
    user.value = null
    if (localStorage) {
      localStorage.removeItem('token')
    }
  }

  return { token, user, login, logout }
})