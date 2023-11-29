<script setup>
import axios from 'axios'
import { ref, reactive, watch, computed } from 'vue';
import { API_CONFIG, API_URL } from '@/stores/api';

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
})

function sendSearchRequest() {
    searchCondition.page = 1
    searchCondition.state = searchRequest.state
    searchCondition.keywordType = searchRequest.keywordType
    searchCondition.keyword = searchRequest.keyword === null ? '' : searchRequest.keyword
    searchCondition.startDate = searchRequest.startDate === null ? '' : searchRequest.startDate + ' 00:00:00'    
    searchCondition.endDate = searchRequest.endDate === null ? '' : searchRequest.endDate + ' 00:00:00'    

    searchQuest()
}

function searchQuest() {
    let queryString = `?`;
    queryString += `page=${searchCondition.page-1}`
    queryString += `&state=${searchCondition.state}`
    queryString += `&keywordType=${searchCondition.keywordType}`
    queryString += `&keyword=${searchCondition.keyword}`
    queryString += `&startDate=${searchCondition.startDate}`
    queryString += `&endDate=${searchCondition.endDate}`

    console.log(queryString)
    
    axios
        .get(`${API_URL.QUEST_SEARCH}${queryString}`, {
            baseURL: API_CONFIG.SERVER_URL,
        })
        .then((res) => {
            if (res) {
                const data = res.data.data

                console.log(data)

                searchResult.list = data.content
                searchResult.totalPages = data.totalPages
            }
        })
}

function formatDateString(dateStr) {
    const split = dateStr.split('T')
    return split[0] + ' ' + split[1]
}

function canCompleteQuest(quest) {
    return quest.detailQuests.length === quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length
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
    
    
    <!-- 페이지 번호 클릭을 통한 페이징 처리 -->
    <!-- 최근 순으로 모든 퀘스트를 표시 -->
    
    <div style="border-radius: 2px;" class="pa-1">
        <div v-if="searchResult.list.length == 0">검색된 퀘스트가 없습니다.</div>
        <VExpansionPanels v-else v-for="(quest, qIndex) in searchResult.list" :key="qIndex" :value="qIndex">
            <VExpansionPanel>
                <VExpansionPanelTitle>
                    <VRow class="align-center">
                        <VCol cols="8">
                            <VRow>
                                <VCol cols="12" class="pa-1">
                                    <span class="ma-1 font-weight-bold">{{ '#' + quest.seq }}</span>
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="primary" v-if="quest.type === 'MAIN'">메인</VChip>
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="secondary" v-else>서브</VChip>
                                    
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="indigo" v-if="quest.state === 'PROCEED'">진행중</VChip>
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="green" v-else-if="quest.state === 'COMPLETE'">완료</VChip>
                                    <VChip class="ma-1 font-weight-bold" label size="small" v-else-if="quest.state === 'DISCARD'">포기</VChip>
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="red" v-else-if="quest.state === 'FAIL'">실패</VChip>
                                </VCol>
                                <VCol cols="12" class="pa-1">
                                    <span class="ma-1 font-weight-bold">{{ quest.title }}</span>
                                </VCol>
                                <VCol cols="12" class="pa-1">
                                    <VChip class="ma-1 font-weight-bold" label size="small" color="yellow-darken-4" v-if="!!quest.deadLine">마감기한 : {{ formatDateString(quest.deadLine) }}</VChip>
                                </VCol>
                            </VRow>
                        </VCol>
                        <VCol>
                            <div>
                                {{ formatDateString(quest.createdDate) }}
                            </div>
                        </VCol>
                        <VCol cols="1">
                            <VChip v-if="quest.detailQuests.length > 0" label :color="canCompleteQuest(quest) ? 'green' : ''">{{ quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length + '/' + quest.detailQuests.length }}</VChip>
                        </VCol>
                    </VRow>
                </VExpansionPanelTitle>
                <VExpansionPanelText>
                    <div class="pb-2" style="white-space: pre-wrap;">{{ quest.description }}</div>
                    <div v-for="(detail, dIndex) in quest.detailQuests" :key="dIndex">
                        <VListItem active class="rounded ma-2">
                            <VListItemTitle class="text-wrap">{{ detail.title }}</VListItemTitle>
                            <template #append>
                                <div style="height:40px; width:64px" class="d-flex align-center justify-center ps-2">
                                    <VCheckboxBtn 
                                        v-if="detail.type === 'CHECK'" 
                                        :model-value="detail.state === 'COMPLETE'"
                                        readonly
                                        >
                                    </VCheckboxBtn>
                                    <VBtn 
                                        v-if="detail.type === 'COUNT'"
                                        rounded="lg" size="small"
                                        class="my-1"
                                        >
                                        {{ detail.count + '/' + detail.targetCount }}
                                    </VBtn>
                                </div>
                            </template>
                        </VListItem>
                    </div>
                </VExpansionPanelText>
            </VExpansionPanel>
        </VExpansionPanels>
        <VPagination v-if="searchResult.totalPages > 0" v-model="page" :length="searchResult.totalPages" :total-visible="6" :show-first-last-page=true></VPagination>
    </div>
    

    
</div>

</template>