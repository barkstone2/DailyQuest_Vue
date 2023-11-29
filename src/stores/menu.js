import { reactive } from 'vue'
import router from '@/router'

const sideMenus = [
  {
    title: '퀘스트',
    value: 'quests',
    icon: 'mdi-clipboard-list-outline'
  },
  {
    title: '상태창',
    value: 'status',
    icon: 'mdi-account-box-outline'
  },
  {
    title: '설정',
    value: 'settings',
    icon: 'mdi-cog-outline'
  },
  {
    title: '관리자 페이지',
    value: 'admin',
    icon: 'mdi-application-cog-outline',
    needAdmin: true
  }
]



export const MENU = reactive({
  sideMenuOpened: false,
  selectedMenuOnSide: '',
  redirectRoute: '/',
  sideMenus: sideMenus,
  toggleSideMenu() {
    this.sideMenuOpened = !this.sideMenuOpened
  },
  navOnSideMenu(menu) {
    this.selectedMenuOnSide = menu
    router.push(`/${menu}`)
  },
  rememberRedirectRoute(path) {
    this.redirectRoute = path
  }
})
