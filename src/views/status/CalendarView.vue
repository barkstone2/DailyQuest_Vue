<script setup>
import axios from 'axios'
import {computed, ref, reactive, watch} from 'vue';
import {API_CONFIG, API_URL} from '@/stores/api';
import dateUtil from '@/utils/dateUtil';
import LoadingLayer from "@/components/common/LoadingLayer.vue";
import QuestSearchResult from "@/components/search/QuestSearchResult.vue";

const calendarLoading = ref(true)

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

const minYear = 2023
const maxYear = yyyy

const localDateOfToday = `${yyyy}-${mm}-${dd}`;

const searchCondition = reactive({
  searchType: 'DAILY',
  selectedDate: localDateOfToday,
})

const searchResult = reactive({
  list: [],
  totalPages: 0,
  requested: false,
  opened: true
})

const watchedSearchType = computed(() => searchCondition.searchType)

watch(watchedSearchType, () => {
  searchCondition.selectedDate = selectedDateOfType[searchCondition.searchType]
  loadStatistics()
})

const result = reactive({
  questStatistics: null,
  startDate: null,
  detail: null,
  emptyCounts: computed(() => {
    if (searchCondition.searchType !== 'DAILY') return 0
    return new Date(result.startDate).getDay()
  }),
})

loadStatistics()

function loadStatistics() {
  searchResult.requested = false
  calendarLoading.value = true

  axios
      .get(`${API_URL.STATUS}/${searchCondition.selectedDate}?searchType=${searchCondition.searchType}`, {
        baseURL: API_CONFIG.SERVER_URL,
      })
      .then((res) => {
        if (res) {
          const data = res.data.data
          result.questStatistics = data.questStatistics;
          result.startDate = Object.keys(data.questStatistics)[0];
          searchCondition.selectedDate = data.selectedDate
          result.detail = data.questStatistics[searchCondition.selectedDate];
          calendarLoading.value = false
        }
      })
}

const selectListState = reactive({
  isOpenedYearSelectList: false,
  isOpenedMonthSelectList: false,
  isOpenedQuarterSelectList: false,
})

const vClickOutside = {
  mounted: function (el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
}

function getFirstMondayOfYear(date) {
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  return getNextOrSameDayOfWeek(firstDayOfYear, 1); // 1 for Monday
}

function getNextOrSameDayOfWeek(date, dayOfWeek) {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
  return resultDate;
}

function calculateWhichQuarterOfDate(dateStr) {
  const date = new Date(dateStr)
  const firstMondayOfYear = getFirstMondayOfYear(date)
  if (date < firstMondayOfYear) {
    return {year: date.getFullYear() - 1, quarter: 4};
  }

  const weekDiff = Math.floor((date - firstMondayOfYear) / (7 * 24 * 60 * 60 * 1000));
  const quarter = Math.floor(weekDiff / 13) + 1;
  return {year: date.getFullYear(), quarter: quarter}
}

function getFirstDayOfQuarter(year, quarter) {
  const date = new Date(year+'-01-01')
  const firstMondayOfYear = getFirstMondayOfYear(date)

  const weeks = (quarter-1) * 13
  const firstDayOfQuarter = new Date(firstMondayOfYear.getTime())
  firstDayOfQuarter.setDate(firstMondayOfYear.getDate() + weeks * 7)

  return dateUtil.getDateStr(firstDayOfQuarter)
}

const dateNavigator = reactive({
  selectedYear: new Date(searchCondition.selectedDate).getFullYear(),
  selectedMonth: new Date(searchCondition.selectedDate).getMonth() + 1,
  selectedQuarterYear: calculateWhichQuarterOfDate(searchCondition.selectedDate).year,
  selectedQuarter: calculateWhichQuarterOfDate(searchCondition.selectedDate).quarter
})

let needDateNavigatorReset = false

const selectedDateOfType = reactive({
  DAILY: searchCondition.selectedDate,
  WEEKLY: searchCondition.selectedDate,
  MONTHLY: searchCondition.selectedDate,
})

watch(dateNavigator, (newValue) => {
  if(needDateNavigatorReset) {
    needDateNavigatorReset = false
    return
  }

  let dateValue;

  switch (searchCondition.searchType) {
    case 'DAILY':
      dateValue = newValue.selectedYear + "-" + String(newValue.selectedMonth).padStart(2, '0') + "-" + "01"
      break;
    case 'WEEKLY':
      dateValue = getFirstDayOfQuarter(newValue.selectedQuarterYear, newValue.selectedQuarter)
      break;
    case 'MONTHLY':
      dateValue = newValue.selectedYear + "-01-01"
      break;
  }

  selectedDateOfType[searchCondition.searchType] = dateValue
  searchCondition.selectedDate = selectedDateOfType[searchCondition.searchType]

  loadStatistics()
})

function dateNavigatorYearSelection(year) {
  switch (searchCondition.searchType) {
    case "WEEKLY":
      dateNavigator.selectedQuarterYear = year
      break
    default:
      dateNavigator.selectedYear = year
      break
  }
}

function dateNavigatorToPrev() {
  switch (searchCondition.searchType) {
    case "DAILY":
      if(dateNavigator.selectedMonth === 1) {
        if(dateNavigator.selectedQuarterYear <= minYear) return
        dateNavigator.selectedYear--
        dateNavigator.selectedMonth = 12
      } else {
        dateNavigator.selectedMonth--
      }
      break
    case "WEEKLY":
      if(dateNavigator.selectedQuarter === 1) {
        if(dateNavigator.selectedQuarterYear <= minYear) return
        dateNavigator.selectedQuarterYear--
        dateNavigator.selectedQuarter = 4
      } else {
        dateNavigator.selectedQuarter--
      }
      break
    case "MONTHLY":
      if(dateNavigator.selectedQuarterYear <= minYear) return
      dateNavigator.selectedYear--
      break
  }
}

function dateNavigatorToNext() {
  switch (searchCondition.searchType) {
    case "DAILY":
      if(dateNavigator.selectedMonth === 12) {
        if(dateNavigator.selectedYear >= maxYear) return
        dateNavigator.selectedYear++
        dateNavigator.selectedMonth = 1
      } else {
        dateNavigator.selectedMonth++
      }
      break
    case "WEEKLY":
      if(dateNavigator.selectedQuarter === 4) {
        if(dateNavigator.selectedYear >= maxYear) return
        dateNavigator.selectedQuarterYear++
        dateNavigator.selectedQuarter = 1
      } else {
        dateNavigator.selectedQuarter++
      }
      break
    case "MONTHLY":
      if(dateNavigator.selectedYear >= maxYear) return
      dateNavigator.selectedYear++
      break
  }
}


const reservedYears = computed(() => {
  const years = []
  for(let year = yyyy; year >= minYear; year--) {
    years.push(year)
  }
  return years
})

function selectDetail(selectedDetail) {
  searchResult.requested = false
  result.detail = selectedDetail
  selectedDateOfType[searchCondition.searchType] = selectedDetail.loggedDate
}

function selectToday() {
  needDateNavigatorReset = true
  selectedDateOfType[searchCondition.searchType] = localDateOfToday
  searchCondition.selectedDate = selectedDateOfType[searchCondition.searchType]

  switch (searchCondition.searchType) {
    case "DAILY":
      dateNavigator.selectedYear = new Date(localDateOfToday).getFullYear()
      dateNavigator.selectedMonth = new Date(localDateOfToday).getMonth() + 1
      break;
    case "WEEKLY": {
      const quarterInfo = calculateWhichQuarterOfDate(localDateOfToday);
      dateNavigator.selectedQuarterYear = quarterInfo.year
      dateNavigator.selectedQuarter = quarterInfo.quarter
      break;
    }
    case "MONTHLY":
      dateNavigator.selectedYear = new Date(localDateOfToday).getFullYear()
      break;
  }

  loadStatistics()
}

const page = ref(1)

watch(page, () => {
  searchCondition.page = page.value
  searchQuest()
})

function sendSearchRequest() {
  if(searchResult.requested) {
    searchResult.opened = !searchResult.opened
    return
  }

  searchCondition.page = 1
  searchCondition.startDate = result.detail.loggedDate
  searchCondition.endDate = result.detail.loggedDate

  searchQuest()
}

function searchQuest() {
  let queryString = `?`;
  queryString += `page=${searchCondition.page-1}`
  queryString += `&startDate=${searchCondition.startDate}`
  queryString += `&endDate=${searchCondition.endDate}`

  axios
      .get(`${API_URL.QUEST_SEARCH}${queryString}`)
      .then((res) => {
        if (res) {
          const data = res.data.data
          searchResult.list = data.content
          searchResult.totalPages = data.totalPages
          searchResult.requested = true
        }
      })
}



</script>
<template>
  <div class="block align-center justify-center no-drag">
    <LoadingLayer v-if="calendarLoading"></LoadingLayer>
    <div class="px-15">
      <div class="d-flex align-center justify-space-between">
        <VTabs bg-color="white" color="black" v-model="searchCondition.searchType" hide-slider align-tabs="center"
               selected-class="selected-tab" class="my-2 w-fit rounded-lg border">
          <VTab value="DAILY">일간</VTab>
          <VTab value="WEEKLY">주간</VTab>
          <VTab value="MONTHLY">월간</VTab>
          <!-- <VTab value="YEARLY" @click="changeStateTab">연간</VTab> -->
        </VTabs>
        <div>
          <div class="date-nav-item border px-2 rounded-sm elevation-3 text-h6" @click="selectToday">Today</div>
        </div>
      </div>
      <div id="dateNavigator" class="d-flex justify-space-between align-center text-h4">
        <VIcon class="date-nav-item" icon="mdi-chevron-left" @click="dateNavigatorToPrev"></VIcon>
        <div class="d-flex py-2">

          <div class="me-4" v-click-outside="() => {selectListState.isOpenedYearSelectList = false}">
            <div class="date-nav-item border px-5 rounded-sm elevation-3"
               @click="selectListState.isOpenedYearSelectList = !selectListState.isOpenedYearSelectList">
              <template v-if="searchCondition.searchType === 'WEEKLY'">{{ dateNavigator.selectedQuarterYear }}</template>
              <template v-else>{{ dateNavigator.selectedYear }}</template>
            </div>
            <div v-if="selectListState.isOpenedYearSelectList"
                class="text-center position-absolute overflow-auto"
                 style="z-index:100; background-color:white; max-height:200px;">
              <template v-for="year in reservedYears" :key="(year)">
                <div class="date-nav-item border px-5 rounded-sm" @click="dateNavigatorYearSelection(year)">{{ year }}</div>
              </template>
            </div>
          </div>

          <div v-if="searchCondition.searchType === 'DAILY'" v-click-outside="() => {selectListState.isOpenedMonthSelectList = false}">
            <div class="date-nav-item border px-5 rounded-sm elevation-3"
                 @click="selectListState.isOpenedMonthSelectList = !selectListState.isOpenedMonthSelectList"
                 >{{ dateNavigator.selectedMonth < 10 ? '0' + dateNavigator.selectedMonth : dateNavigator.selectedMonth }}</div>
            <div v-if="selectListState.isOpenedMonthSelectList"
                class="text-center position-absolute overflow-auto"
                 style="z-index:100; background-color:white; max-height:200px;">
              <template v-for="month in 12" :key="month">
                <div class="date-nav-item border px-5 rounded-sm" @click="dateNavigator.selectedMonth = month">{{ month < 10 ? '0' + month : month }}</div>
              </template>
            </div>
          </div>
          <div v-else-if="searchCondition.searchType === 'WEEKLY'" v-click-outside="() => {selectListState.isOpenedQuarterSelectList = false}">
            <div class="date-nav-item border px-5 rounded-sm elevation-3"
                 @click="selectListState.isOpenedQuarterSelectList = !selectListState.isOpenedQuarterSelectList"
            >{{ dateNavigator.selectedQuarter }}</div>
            <div v-if="selectListState.isOpenedQuarterSelectList"
                 class="text-center position-absolute overflow-auto"
                 style="z-index:100; background-color:white; max-height:200px;">
              <template v-for="quarter in 4" :key="quarter">
                <div class="date-nav-item border px-5 rounded-sm" @click="dateNavigator.selectedQuarter = quarter">{{ quarter }}</div>
              </template>
            </div>
          </div>


        </div>
        <VIcon class="date-nav-item" icon="mdi-chevron-right" @click="dateNavigatorToNext"></VIcon>
      </div>
      <div class="d-flex justify-center">
        <div class="border justify-center">
          <div class="calendar-header" v-show="searchCondition.searchType === 'DAILY'">
            <div class="text-h6 font-weight-bold">월</div>
            <div class="text-h6 font-weight-bold">화</div>
            <div class="text-h6 font-weight-bold">수</div>
            <div class="text-h6 font-weight-bold">목</div>
            <div class="text-h6 font-weight-bold">금</div>
            <div class="text-h6 font-weight-bold">토</div>
            <div class="text-h6 font-weight-bold">일</div>
          </div>
          <div class="calendar-row">
            <div v-for="i in result.emptyCounts" :key="i"></div>
            <div class="calendar-info"
                 v-for="(statistic, _, index) in result.questStatistics"
                 :key="statistic.loggedDate"
                 :class="{'selected-date': result.detail?.loggedDate === statistic.loggedDate }"
                 @click="selectDetail(statistic)">
              <div class="text-end pt-2 pe-2 text-h5" v-if="searchCondition.searchType === 'DAILY'">
                {{ dateUtil.getDateFromStr(statistic.loggedDate) }}
              </div>
              <div class="text-start pt-2 ps-2 text-h6" v-else-if="searchCondition.searchType === 'WEEKLY'">
                {{ dateUtil.getMonthWithDay(statistic.loggedDate) }} ~
              </div>
              <div class="text-center pt-2 text-h5" v-else-if="searchCondition.searchType === 'MONTHLY'">{{
                  index + 1
                }}월
              </div>
              <div>
                <div>등록 : {{ statistic.registeredCount }}</div>
                <div>완료 : {{ statistic.completeCount }}</div>
                <div>완료율 : {{ statistic.stateRatio }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VContainer class="detail-container rounded border my-8" v-if="result.detail != null">
        <VRow class="align-center border-b">
          <VCol cols="12">
            <div v-if="searchCondition.searchType === 'DAILY'">{{ result.detail.loggedDate }}</div>
            <div v-else-if="searchCondition.searchType === 'WEEKLY'">
              {{ dateUtil.getMonthWithDay(result.detail.loggedDate) }} ~
              {{ dateUtil.getSixDayAfter(result.detail.loggedDate) }}
            </div>
            <div v-else-if="searchCondition.searchType === 'MONTHLY'">{{
                dateUtil.getMonth(result.detail.loggedDate)
              }}월
            </div>
          </VCol>
        </VRow>
        <VRow class="border-b">
          <VCol cols="6">
            상태별
          </VCol>
          <VCol cols="6">
            타입별
          </VCol>
        </VRow>
        <VRow class="border-b">
          <VCol cols="6" class="border-e">
            <VRow>
              <VCol cols="6">등록한 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.registeredCount }}</VCol>
              <VCol cols="6">완료한 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.completeCount }}</VCol>
              <VCol cols="6">실패한 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.failCount }}</VCol>
              <VCol cols="6">포기한 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.discardCount }}</VCol>
              <VCol cols="6">완료율</VCol>
              <VCol cols="6">{{ result.detail.stateRatio }}%</VCol>
            </VRow>
          </VCol>
          <VCol cols="6">
            <VRow>
              <VCol cols="6">메인 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.mainCount }}</VCol>
              <VCol cols="6">서브 퀘스트</VCol>
              <VCol cols="6">{{ result.detail.subCount }}</VCol>
              <VCol cols="6">메인 퀘스트 비율</VCol>
              <VCol cols="6">{{ result.detail.typeRatio }}%</VCol>
            </VRow>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <div class="d-inline-block date-nav-item border px-2 rounded-sm elevation-3 text-h6"
                 @click="sendSearchRequest"
                 v-text="searchResult.requested && searchResult.opened ? '퀘스트 목록 닫기' : '퀘스트 목록 보기'"
                 :class="searchResult.requested && searchResult.opened ? 'mb-3' : ''"
            ></div>
            <QuestSearchResult
                v-if="searchResult.requested"
                v-show="searchResult.opened"
                :list="searchResult.list"
                :total-pages="searchResult.totalPages"
                :current-page="page"
                @update:page="newValue => page = newValue"
                empty-message="퀘스트 기록이 없습니다."/>
          </VCol>
        </VRow>
      </VContainer>
    </div>
  </div>

</template>
<style>

.calendar-container {
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, minmax(50px, 150px));
  grid-template-rows: 50px auto;
}

.calendar-header > div {
  background-color: aliceblue;
  border-bottom: 0.1px solid black;
  align-items: center;
  color: black;
  display: flex;
  justify-content: center;
}

.calendar-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(50px, 150px));
  grid-auto-rows: minmax(50px, 150px);
  text-align: center;
}

.calendar-row > div {
  border-right: 0.1px solid black;
  border-bottom: 0.1px solid black;
  min-width: 50px;
  min-height: 50px;
  background-color: white;
}

.calendar-info {
  display: grid;
  grid-template-rows: min-content;
  color: black;
}

.calendar-info:hover {
  background-color: cadetblue;
  cursor: pointer;
}

.selected-date {
  background-color: rgb(117, 172, 117) !important;
}

.detail-container {
  background-color: aliceblue;
  color: black;
  text-align: center;
}

.detail-container div {
  font-weight: bold;
}

.detail-row {
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  text-align: center;
}

.date-nav-item:hover {
  background-color: lightgrey;
  cursor: pointer;
}

</style>