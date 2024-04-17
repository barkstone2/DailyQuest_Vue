import axios from 'axios'
import { reactive, ref } from 'vue'
import {API_CONFIG, API_URL} from '@/stores/api'


function getSettings() {
  axios
    .get(API_URL.ADMIN_SETTING_GET, {
      baseURL: admin.baseURL
    })
    .then((res) => {
      if (res) {
        const data = res.data.data

        admin.settings.questClearExp = data.questClearExp
        admin.settings.questClearGold = data.questClearGold
        admin.settings.maxRewardCount = data.maxRewardCount
      }
    })
}

function getExpTable() {
  axios
    .get(API_URL.ADMIN_EXP_TABLE_GET, {
      baseURL: admin.baseURL
    })
    .then((res) => {
      if (res) {
        admin.expTable = res.data.data
        lastLevel.value = Object.keys(admin.expTable).length.toString()
      }
    })
}

const lastLevel = ref("1")

export const admin = reactive({
  baseURL: API_CONFIG.ADMIN_SERVER_URL,
  settings: {
    questClearExp: 0,
    questClearGold: 0,
    maxRewardCount: 0
  },
  expTable: {},
  submitting: false,
  isLastLevel(level) {
    return level === lastLevel.value
  },
  getSettings: getSettings,
  getExpTable: getExpTable,
  addNewLevel() {
    admin.expTable[++lastLevel.value] = 0

    const scrollRow = document.getElementById('scrollRow')
    scrollRow.scrollTop = scrollRow.scrollHeight
  },
  deleteLastLevel() {
    delete admin.expTable[lastLevel.value--]
    admin.expTable[lastLevel.value] = 0

    const scrollRow = document.getElementById('scrollRow')
    scrollRow.scrollTop = scrollRow.scrollHeight
  }
})
