import axios, {Cancel} from 'axios'
import router from '@/router'
import { API_CONFIG } from '@/stores/api'
import { PRINCIPAL } from '@/stores/principal'

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_CONFIG.SERVER_URL

const pendingRequests = new Set();
axios.interceptors.request.use(config => {
  let method = config.method;
  if(method !== ('get' || 'GET')) {
    let requestKey = `${method} ${config.url}`
    if(pendingRequests.has(requestKey)) {
      return Promise.reject(new Cancel())
    }
    pendingRequests.add(requestKey)
  }
  return config
})
axios.interceptors.response.use(
  (response) => {
    if(response.config.method !== ('get' || 'GET')) {
      pendingRequests.delete(`${response.config.method} ${response.config.url}`);
    }
    return response
  },
  (error) => {
    // server error 핸들링
    if(error.code === 'ERR_NETWORK') {
      API_CONFIG.SERVER_ERROR = true
      PRINCIPAL.invalidate()
      router.push('/error')
      return
    }

    API_CONFIG.SERVER_ERROR = false

    if(axios.isCancel(error)) {
      alert('요청 처리 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    pendingRequests.delete(`${error.config.method} ${error.config.url}`)

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