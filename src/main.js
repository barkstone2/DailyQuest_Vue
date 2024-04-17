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

// 페이지 로드 시 사용자 정보 동기화
await PRINCIPAL.synchronize()

router.beforeEach((to, from, next) => {
  // 서버 에러 시 핸들링
  if(API_CONFIG.SERVER_ERROR) {
    if (to.path === "/error") {
      next()
    } else {
      next("/error")
    }
    return
  } else if (to.path === "/error") {
    next("/")
    return
  }

  // 로그인된 상태로 로그인 페이지로 이동하는 경우
  if (PRINCIPAL.id && to.path === '/login') {
    next(from.path)
  }
  // 관리자 페이지 접근 시 권한이 없는 경우
  else if (!PRINCIPAL.isAdmin && to.meta['needAdmin']) {
    alert('권한이 없습니다.')
    next(from.path)
  }
  // 로그인 되지 않은 상태로 권한이 필요한 페이지에 접근하는 경우
  else if (!PRINCIPAL.id && to.meta['needAuthentication']) {
    MENU.rememberRedirectRoute(to.path)
    next("/login")
  }
  // 정상 라우팅
  else {
    // 접근한 페이지가 사이드 메뉴에 존재하는 경우
    if (to.meta['group']) {
      MENU.selectedMenuOnSide = to.meta['group']
    }
    next()
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
