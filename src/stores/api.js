const ENV = import.meta.env

const GOOGLE_CLIENT_ID = ENV.VITE_GOOGLE_CLIENT_ID
const SERVER_DOMAIN = ENV.VITE_API_URL
export const API_CONFIG = {
  SERVER_URL: SERVER_DOMAIN + '/api/v1',
  ADMIN_SERVER_URL: SERVER_DOMAIN + '/admin/api/v1',
  GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  NICKNAME_VALIDATION_REGEX: /^[a-zA-Z0-9가-힣][a-zA-Z0-9가-힣\s]{0,18}[a-zA-Z0-9가-힣]$/,
  SERVER_ERROR: false
}

const USER_PREFIX = '/users'
const QUEST_PREFIX = '/quests'
const TOKEN_PREFIX = '/auth'

export const API_URL = {
  USER_GET: USER_PREFIX,
  USER_UPDATE: USER_PREFIX,
  TOKEN_PREFIX: '/auth',
  TOKEN_ISSUE: `${TOKEN_PREFIX}/issue`,
  TOKEN_INVALIDATE: `${TOKEN_PREFIX}/logout`,
  ADMIN_SETTING_GET: '/reward',
  ADMIN_SETTING_UPDATE: '/reward',
  ADMIN_EXP_TABLE_GET: '/exp-table',
  ADMIN_EXP_TABLE_UPDATE: '/exp-table',
  QUEST_PREFIX: '/quests',
  QUEST_LIST_GET: QUEST_PREFIX,
  QUEST_SAVE: QUEST_PREFIX,
  QUEST_UPDATE: (questId) => `${QUEST_PREFIX}/${questId}`,
  QUEST_DETAIL_UPDATE: (questId, detailId) => `${QUEST_PREFIX}/${questId}/details/${detailId}`,
  QUEST_COMPLETE: (questId) => `${QUEST_PREFIX}/${questId}/complete`,
  QUEST_DISCARD: (questId) => `${QUEST_PREFIX}/${questId}/discard`,
  QUEST_DELETE: (questId) => `${QUEST_PREFIX}/${questId}/delete`,
  QUEST_SEARCH: `${QUEST_PREFIX}/search`,
  STATUS: '/status'
}
