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
  principal.id = data.id
  principal.nickname = data.nickname
  principal.providerType = data.providerType
  principal.authorities = data.authorities
  principal.level = data.level
  principal.currentExp = data.currentExp
  principal.requireExp = data.requireExp
  principal.gold = data.gold
  principal.resetTime = data.resetTime
  principal.coreTime = data.coreTime
  principal.resetTimeLastModifiedDate = data.resetTimeLastModifiedDate
  principal.coreTimeLastModifiedDate = data.coreTimeLastModifiedDate

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

export const principal = reactive({
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
    return principal.authorities.indexOf('ROLE_ADMIN') > -1
  }),
  canUpdateCoreTime: computed(() => {
    return isBeforeOneDayFromNowOrIsNull(principal.coreTimeLastModifiedDate)
  }),
  canUpdateResetTime: computed(() => {
    return isBeforeOneDayFromNowOrIsNull(principal.resetTimeLastModifiedDate)
  }),
  remainTimeUntilToUpdateCoreTime: computed(() => {
    return calcRemainTimeUntilToUpdate(principal.coreTimeLastModifiedDate)
  }),
  remainTimeUntilToUpdateResetTime: computed(() => {
    return calcRemainTimeUntilToUpdate(principal.resetTimeLastModifiedDate)
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
