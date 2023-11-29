import axios from 'axios'
import router from '@/router'
import { API_CONFIG } from '@/stores/api'
import { principal } from '@/stores/principal'

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_CONFIG.SERVER_URL

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.config.url === '/users') return
    const state = error.response.status

    switch (state) {
      case 401:
        principal.invalidate()
        router.push('/login')
        break

      default:
        return Promise.reject(error)
    }
  }
)
