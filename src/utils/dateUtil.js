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
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  },
  getDateTimeStr(date) {
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);

    return `${this.getDateStr(date)} ${hour}:${minute}`;
  }
}

export default dateUtil
