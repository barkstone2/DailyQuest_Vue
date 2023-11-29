import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meat: { needAuthentication: true }
  },
  {
    path: '/:pathMatches(.*)',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
]

const questMeta = { group: 'quests', needAuthentication: true }
const questRoutes = [
  {
    path: '/quests',
    name: 'questsList',
    meta: questMeta,
    component: () => import('../views/quest/QuestListView.vue')
  },
  {
    path: '/quests/save',
    name: 'questSave',
    meta: questMeta,
    component: () => import('../views/quest/QuestFormView.vue')
  },
  {
    path: '/quests/:questId(\\d+)',
    name: 'questUpdate',
    meta: questMeta,
    component: () => import('../views/quest/QuestFormView.vue')
  }
]

routes.push(...questRoutes)

const settingsMeta = { group: 'setting', needAuthentication: true };
const settingsRoutes = [
  {
    path: '/settings',
    name: 'setting',
    meta: settingsMeta,
    component: () => import('../views/SettingView.vue')
  },
]

routes.push(...settingsRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
