import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import vuetify from './vuetify'

import '@/assets/main.css'
import '@/axios/index'
import '@mdi/font/css/materialdesignicons.css'

import { principal } from '@/stores/principal'
import { menu } from '@/stores/menu'

if (!principal.id) {
  principal.synchronize()
}

router.beforeEach((to, from) => {
  // 로그인 페이지에서 다시 로그인 페이지로 이동하는 경우
  if (from.path === '/login' && to.path === '/login') {
    return false
  }

  // 로그인된 상태로 로그인 페이지로 이동하는 경우
  if (principal.id && to.path === '/login') {
    return router.go(-1)
  }

  // 관리자 페이지 접근 시 권한이 없는 경우
  if (!principal.isAdmin && to.meta.needAdmin) {
    alert('권한이 없습니다.')
    return router.go(-1)
  }

  // 로그인 되지 않은 상태로 권한이 필요한 페이지에 접근하는 경우
  if (!principal.id && to.meta.needAuthentication) {
    menu.rememberRedirectRoute(to.path)
    return { path: '/login' }
  }

  // 접근한 페이지가 사이드 메뉴에 존재하는 경우
  if (to.meta.group) {
    menu.selectedMenuOnSide = to.meta.group
  }
})

router.onError((error) => {
  if(error.errorCode === 401) {
    return { path : '/login' }
  }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
