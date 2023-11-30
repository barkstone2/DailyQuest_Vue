import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import vuetify from './vuetify'

import '@/assets/main.css'
import '@/axios/index'
import '@mdi/font/css/materialdesignicons.css'

import { PRINCIPAL } from '@/stores/principal'
import { MENU } from '@/stores/menu'
import {API_CONFIG} from "@/stores/api";

if(!API_CONFIG.SERVER_ERROR) {
  // 현재 사용자 정보가 없을 때 동기화 시도. 실패 시 로그인 화면으로 이동
  if (!PRINCIPAL.id) {
    PRINCIPAL.synchronize()
  }
}
router.beforeEach((to, from) => {
  if(API_CONFIG.SERVER_ERROR) return

  // 로그인 페이지에서 다시 로그인 페이지로 이동하는 경우
  if (from.path === '/login' && to.path === '/login') {
    return false
  }

  // 로그인된 상태로 로그인 페이지로 이동하는 경우
  if (PRINCIPAL.id && to.path === '/login') {
    return router.go(-1)
  }

  // 관리자 페이지 접근 시 권한이 없는 경우
  if (!PRINCIPAL.isAdmin && to.meta.needAdmin) {
    alert('권한이 없습니다.')
    return router.go(-1)
  }

  // 로그인 되지 않은 상태로 권한이 필요한 페이지에 접근하는 경우
  if (!PRINCIPAL.id && to.meta.needAuthentication) {
    MENU.rememberRedirectRoute(to.path)
    return { path: '/login' }
  }

  // 접근한 페이지가 사이드 메뉴에 존재하는 경우
  if (to.meta.group) {
    MENU.selectedMenuOnSide = to.meta.group
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
