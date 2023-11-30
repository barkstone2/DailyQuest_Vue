import axios from 'axios'
import router from '@/router'
import { API_CONFIG } from '@/stores/api'
import { PRINCIPAL } from '@/stores/principal'

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_CONFIG.SERVER_URL

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // server error 핸들링
    if(error.code === 'ERR_NETWORK') {
      API_CONFIG.SERVER_ERROR = true
      PRINCIPAL.invalidate()
      if(error.config.url === '') return Promise.reject(error)
      router.push('/error')
      return
    }

    // Principal sync 처리 시에 발생하는 오류는 무시
    if (error.config.url === '/users') return
    const state = error.response.status

    // 토큰이 만료 됐을 때의 처리
    switch (state) {
      case 401:
        PRINCIPAL.invalidate()
        router.push('/login')
        break
      default:
        return Promise.reject(error)
    }
  }
)
