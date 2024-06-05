<script setup>
import axios from 'axios'
import { ref, reactive, watch, computed } from 'vue';
import { API_URL } from '@/stores/api';
import QuestSearchResult from "@/components/search/QuestSearchResult.vue";

const keywordTypeItems = [
    { title: '전체', value: 'ALL' },
    { title: '제목', value: 'TITLE' },
    { title: '제목/설명', value: 'TITLE_AND_DESCRIPTION' },
    { title: '설명', value: 'DESCRIPTION' },
    { title: '세부 제목', value: 'DETAIL_TITLES' },
]

const stateItems = [
    { title: '전체', value: '' },
    { title: '진행', value: 'PROCEED' },
    { title: '완료', value: 'COMPLETE' },
    { title: '포기', value: 'DISCARD' },
    { title: '실패', value: 'FAIL' },
]

const searchRequest = reactive({
    state: '',
    keywordType: 'ALL',
    keyword: null,
    startDate: null,
    endDate: null,
})

const watchedStartDate = computed(() => searchRequest.startDate)
const watchedEndDate = computed(() => searchRequest.endDate)

watch(watchedStartDate, (_, oldValue) => {
    if (searchRequest.endDate === null) return
    if (new Date(searchRequest.startDate) > new Date(searchRequest.endDate)) {
        alert('시작일이 종료일보다 나중일 수 없습니다.')
        searchRequest.startDate = oldValue
    }
})

watch(watchedEndDate, (_, oldValue) => {
    if (searchRequest.startDate === null) return
    if (new Date(searchRequest.startDate) > new Date(searchRequest.endDate)) {
        alert('종료일이 시작일보다 먼저일 수 없습니다.')
        searchRequest.endDate = oldValue
    }
})

const searchCondition = {
    page: 1,
    state: '',
    keywordType: 'ALL',
    keyword: '',
    startDate: '',
    endDate: '',
}

const page = ref(1)

watch(page, () => {
    searchCondition.page = page.value
    searchQuest()
})

const searchResult = reactive({
    list: [],
    totalPages: 0,
    isLoading: false,
})

function sendSearchRequest() {
    searchCondition.page = 1
    searchCondition.state = searchRequest.state
    searchCondition.keywordType = searchRequest.keywordType
    searchCondition.keyword = searchRequest.keyword === null ? '' : searchRequest.keyword
    searchCondition.startDate = searchRequest.startDate === null ? '' : searchRequest.startDate
    searchCondition.endDate = searchRequest.endDate === null ? '' : searchRequest.endDate

    searchQuest()
}

function searchQuest() {
  searchResult.isLoading = true
    let queryString = `?`;
    queryString += `page=${searchCondition.page-1}`
    queryString += `&state=${searchCondition.state}`
    queryString += `&keywordType=${searchCondition.keywordType}`
    queryString += `&keyword=${searchCondition.keyword}`
    queryString += `&startDate=${searchCondition.startDate}`
    queryString += `&endDate=${searchCondition.endDate}`

    axios
        .get(`${API_URL.QUEST_SEARCH}${queryString}`)
        .then((res) => {
            if (res) {
              const data = res.data.data
              searchResult.list = data.content
              searchResult.totalPages = data.totalPages
              searchResult.isLoading = false
            }
        })
}

</script>

<template>

<div class="block">
    <div class="d-flex pa-1">
        <VSelect :items="keywordTypeItems" v-model="searchRequest.keywordType" style="max-width: 15%;" class="mr-1" label="검색 타입"></VSelect>
        <VTextField class="rounded pr-2" clearable label="검색어" v-model="searchRequest.keyword" @keydown.enter="sendSearchRequest"></VTextField>
        <div class="d-flex align-center" style="height: 58px;">
            <VBtn rounded="lg" color="green" :onClick="sendSearchRequest">검색</VBtn>
        </div>
    </div>
    <div class="d-flex pa-1">
        <VSelect :items="stateItems" v-model="searchRequest.state" label="퀘스트 타입" style="max-width: 15%;" class="mr-1"></VSelect>
        <VTextField type="date" class="pr-1" v-model="searchRequest.startDate" clearable label="검색 시작일"></VTextField>
        <span style="height:58px;" class="d-flex align-center">~</span>
        <VTextField type="date" class="pl-1" v-model="searchRequest.endDate" clearable label="검색 종료일"></VTextField>
    </div>
  <QuestSearchResult
      :list="searchResult.list"
      :total-pages="searchResult.totalPages"
      :current-page="page"
      :is-loading="searchResult.isLoading"
      @update:page="newValue => page = newValue"
      empty-message="검색된 퀘스트가 없습니다."/>
</div>

</template>