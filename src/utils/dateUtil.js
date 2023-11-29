const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

const dateUtil = {
  getDayOfWeek(date) {
    return days[date.getDay()]
  },
  getDateFromStr(dateStr) {
    return new Date(dateStr).getDate()
  },
  getMonthWithDay(dateStr) {
    const date = new Date(dateStr)
    return date.getMonth() + 1 + '/' + date.getDate()
  },
  getMonth(dateStr) {
    return new Date(dateStr).getMonth() + 1
  },
  getSixDayAfter(dateStr) {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + 6)
    return date.getMonth() + 1 + '/' + date.getDate()
  },
  getDateStr(date) {
    let resultStr = date.getFullYear() + "-"

    if(date.getMonth() + 1 < 10) resultStr += '0'
    resultStr += (date.getMonth() + 1) + "-"

    if(date.getDate() < 10) resultStr += '0'
    resultStr += date.getDate()

    return resultStr
  }
}

export default dateUtil
