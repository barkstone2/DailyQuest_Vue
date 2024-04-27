import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import router from '@/router'
import {API_URL} from '@/stores/api'

const nowDate = new Date()
nowDate.setSeconds(0)

const now = ref(nowDate)

setInterval(() => {
  const nowDate = new Date()
  nowDate.setSeconds(0)
  now.value = nowDate
}, 60 * 1000)

function updatePrincipal(data) {
  PRINCIPAL.id = data.id
  PRINCIPAL.nickname = data.nickname
  PRINCIPAL.providerType = data.providerType
  PRINCIPAL.authorities = data.authorities
  PRINCIPAL.level = data.level
  PRINCIPAL.currentExp = data.currentExp
  PRINCIPAL.requireExp = data.requireExp
  PRINCIPAL.gold = data.gold
  PRINCIPAL.resetTime = 6
  PRINCIPAL.coreTimeHour = data.coreTimeHour
  PRINCIPAL.resetTimeLastModifiedDate = data.resetTimeLastModifiedDate
  PRINCIPAL.coreTimeLastModifiedDate = data.coreTimeLastModifiedDate
  PRINCIPAL.notificationCount = data.notificationCount
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
  resetTime: 6,
  coreTimeHour: 0,
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
  },
  logout() {
    axios.post(API_URL.TOKEN_INVALIDATE)
      .then(() => {
        this.invalidate()
        router.push('/login')
      })
  },
  async synchronize() {
    await axios.get(API_URL.USER_GET)
        .then((res) => {
          if (res) {
            const data = res.data.data
            updatePrincipal(data)
          }
        })
  },
  getExpText() {
    const ratio = Math.floor(this.currentExp * 100 / this.requireExp)
    return `${this.currentExp} / ${this.requireExp}(${ratio}%)`
  },
  nextResetTime: computed(() => {
    let nextResetTime = new Date();
    nextResetTime.setHours(PRINCIPAL.resetTime, 0, 0, 0);
    if(nextResetTime < now.value) {
      nextResetTime.setDate(nextResetTime.getDate() + 1)
    }
    return nextResetTime
  }),
  resetTimeDelayMs: 9 * 60 * 1000
})
