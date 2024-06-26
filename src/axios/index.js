import axios, {Cancel} from 'axios'
import router from '@/router'
import {API_CONFIG, API_URL} from '@/stores/api'
import { PRINCIPAL } from '@/stores/principal'
import {LAYOUT} from "@/stores/layout";

axios.defaults.withCredentials = true
axios.defaults.baseURL = API_CONFIG.SERVER_URL

const isCommandRequest = (config) => { return ['post', 'patch', 'put', 'delete'].includes(config.method.toLowerCase()) }
const createRequestKey = (config) => { return `${config.method} ${config.url}` }

const pendingRequests = new Set();
axios.interceptors.request.use(config => {
  console.log(config.method.toLowerCase())
  if (isCommandRequest(config)) {
    const requestKey = createRequestKey(config)
    if (pendingRequests.has(requestKey)) {
      return Promise.reject(new Cancel())
    }
    console.log('command quest')
    LAYOUT.showRequestProcessLayout = true
    pendingRequests.add(requestKey)
  }
  return config
});

const responseInterceptor = (response) => {
  const config = response.config;
  if(isCommandRequest(config)) {
    const requestKey = createRequestKey(config)
    pendingRequests.delete(requestKey);
    LAYOUT.showRequestProcessLayout = false
  }
  if (config.url !== API_URL.USER_GET) {
    PRINCIPAL.synchronize().then(() => {})
  }
  return response
};

const errorInterceptor = (error) => {
  LAYOUT.showRequestProcessLayout = false
  const isServerError = (error) => { return error.code === 'ERR_NETWORK' }
  if(isServerError(error)) {
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
  
  const config = error.config
  const requestKey = createRequestKey(config)
  pendingRequests.delete(requestKey)
  
  // Principal sync 처리 시에 발생하는 오류는 무시
  const isUserSync = (config) => { return config.method.toLowerCase() === 'get' && config.url === '/users' }
  if (isUserSync(config)) {
    return
  }
  
  const response = error.response
  const state = response.status
  const data = response.data
  const message = data?.errorResponse?.message
  alert(message)
  
  switch (state) {
    case 401:
      PRINCIPAL.invalidate()
      router.push('/login')
      break
  }
  return Promise.reject(message)
};

axios.interceptors.response.use(
  responseInterceptor,
  errorInterceptor
)