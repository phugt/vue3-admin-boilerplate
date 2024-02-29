import axios, { type AxiosInstance } from "axios"
import swal from "@/swal"
import { useAuthStore } from "@/stores/auth"
import { useI18n } from 'vue-i18n'
import router from "./router"

var api: AxiosInstance;

export const useAxios = () => {
    const i18n = useI18n()
    if (!api) {
        api = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 30000
        })

        if (useAuthStore().token) {
            api.defaults.headers.common["Authorization"] = 'Bearer ' + useAuthStore().token
        }
        api.defaults.headers.common["Accept-Language"] = i18n.locale.value

        api.interceptors.response.use(function (response) {
            return response
        }, function (error) {
            if (!error.response) {
                swal.fire(i18n.t('error'), i18n.t('apiConnectionError'), 'error')
                return Promise.reject()
            } else {
                switch (error.response.status) {
                    case 400:
                        swal.fire(i18n.t('warning'), i18n.t('invalidInput'), 'warning')
                        break
                    case 401:
                        swal.fire(i18n.t('warning'), i18n.t('notAuthenticated'), 'warning').then(() => {
                            useAuthStore().logout()
                            router.push('/login')
                        })
                        break
                    case 403:
                        swal.fire(i18n.t('warning'), i18n.t('notAuthorized'), 'warning')
                        break
                    case 404:
                        swal.fire(i18n.t('warning'), i18n.t('notFound'), 'warning')
                        break
                    case 422:
                        break
                    default:
                        swal.fire(i18n.t('error'), i18n.t('apiConnectionError'), 'error')
                }
                return Promise.reject(error.response)
            }
        })
    }

    return { api }
}
