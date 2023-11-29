import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import router from '@/router'
import { API_URL } from '@/stores/api'

const ENV = import.meta.env
const LOCAL_STORAGE_KEY = ENV.VITE_LOCAL_STORAGE_KEY

const nowDate = new Date()
nowDate.setSeconds(0)

const now = ref(nowDate)

setInterval(() => {
  const nowDate = new Date()
  nowDate.setSeconds(0)
  now.value = nowDate
}, 60 * 1000)

function isLoggedIn() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY)
}

function updatePrincipal(data) {
  PRINCIPAL.id = data.id
  PRINCIPAL.nickname = data.nickname
  PRINCIPAL.providerType = data.providerType
  PRINCIPAL.authorities = data.authorities
  PRINCIPAL.level = data.level
  PRINCIPAL.currentExp = data.currentExp
  PRINCIPAL.requireExp = data.requireExp
  PRINCIPAL.gold = data.gold
  PRINCIPAL.resetTime = data.resetTime
  PRINCIPAL.coreTime = data.coreTime
  PRINCIPAL.resetTimeLastModifiedDate = data.resetTimeLastModifiedDate
  PRINCIPAL.coreTimeLastModifiedDate = data.coreTimeLastModifiedDate

  const newPrincipal = {
    id: data.id,
    nickname: data.nickname,
    providerType: data.providerType,
    authorities: data.authorities,
    level: data.level,
    currentExp: data.currentExp,
    requireExp: data.requireExp,
    gold: data.gold,
    resetTime: data.resetTime,
    coreTime: data.coreTime,
    resetTimeLastModifiedDate: data.resetTimeLastModifiedDate,
    coreTimeLastModifiedDate: data.coreTimeLastModifiedDate
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrincipal))
}

function getPrincipalFromLocalStorage() {
  const json = localStorage.getItem(LOCAL_STORAGE_KEY)
  return JSON.parse(json)
}

function isBeforeOneDayFromNowOrIsNull(compareDate) {
  if (compareDate === null) return true
  const oneDayAfter = new Date(new Date(compareDate).getTime() + 24 * 60 * 60 * 1000)

  return oneDayAfter.getTime() < now.value.getTime()
}

function calcRemainTimeUntilToUpdate(compareDate) {
  const oneDayAfter = new Date(new Date(compareDate).getTime() + 24 * 60 * 60 * 1000)

  const differenceInMilliseconds = Math.abs(oneDayAfter - now.value)
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60))
  const hours = Math.floor(differenceInMinutes / 60)
  const minutes = differenceInMinutes % 60
  return `${hours}시간 ${minutes}분`
}

export const PRINCIPAL = reactive({
  id: null,
  nickname: '',
  providerType: '',
  authorities: [],
  level: 0,
  currentExp: 0,
  requireExp: 0,
  gold: 0,
  resetTime: 0,
  coreTime: 0,
  resetTimeLastModifiedDate: null,
  coreTimeLastModifiedDate: null,
  isAdmin: computed(() => {
    return PRINCIPAL.authorities.indexOf('ROLE_ADMIN') > -1
  }),
  canUpdateCoreTime: computed(() => {
    return isBeforeOneDayFromNowOrIsNull(PRINCIPAL.coreTimeLastModifiedDate)
  }),
  canUpdateResetTime: computed(() => {
    return isBeforeOneDayFromNowOrIsNull(PRINCIPAL.resetTimeLastModifiedDate)
  }),
  remainTimeUntilToUpdateCoreTime: computed(() => {
    return calcRemainTimeUntilToUpdate(PRINCIPAL.coreTimeLastModifiedDate)
  }),
  remainTimeUntilToUpdateResetTime: computed(() => {
    return calcRemainTimeUntilToUpdate(PRINCIPAL.resetTimeLastModifiedDate)
  }),
  invalidate() {
    this.id = null
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  },
  logout() {
    axios.post(API_URL.TOKEN_INVALIDATE).then(() => {
      this.invalidate()
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      router.push('/login')
    })
  },
  async synchronize(force = false) {
    if (isLoggedIn() && !force) {
      const data = getPrincipalFromLocalStorage()
      updatePrincipal(data)
    } else {
      await axios.get(API_URL.USER_GET).then((res) => {
        if (res) {
          const data = res.data.data
          updatePrincipal(data)
        }
      })
    }
  },
  getExpText() {
    const ratio = (this.currentExp / this.requireExp) * 100
    return `${this.currentExp} / ${this.requireExp}(${ratio}%)`
  }
})
