import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { needAuthentication: true }
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
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/ServerErrorView.vue')
  },
  {
    path: '/test/login',
    name: 'testLogin',
    component: () => import('@/views/TestLoginView.vue')
  }
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

const statusMeta = { group: 'status', needAuthentication: true }
const statusRoutes = [
  {
    path: '/status',
    name: 'status',
    meta: statusMeta,
    component: () => import('../views/status/StatusView.vue'),
    children: [
      {
        name: 'statistics',
        path: '',
        meta: statusMeta,
        component: () => import('../views/status/CalendarView.vue')
      },
      {
        name: 'quest-history',
        path: 'history',
        meta: statusMeta,
        component: () => import('../views/status/HistoryView.vue')
      },
      {
        name: 'achievements',
        path: 'achievements',
        meta: statusMeta,
        component: () => import('@/views/achievement/AchievementListView.vue')
      }
    ]
  },
]

routes.push(...statusRoutes)

const adminMeta = { group: 'admin', needAdmin: true };
const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    meta: adminMeta,
    component: () => import('../views/admin/AdminView.vue'),
    children: [
      {
        path: '',
        name: 'system',
        meta: adminMeta,
        component: () => import('../views/admin/AdminSettingsView.vue')
      },
      {
        path: 'exp-table',
        name: 'exp-table',
        meta: adminMeta,
        component: () => import('../views/admin/AdminExpTableView.vue')
      },
      {
        name: 'admin-achievements',
        path: 'achievements',
        meta: adminMeta,
        component: () => import('@/views/achievement/AdminAchievementListView.vue')
      }
    ]
  }
]

routes.push(...adminRoutes)

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
