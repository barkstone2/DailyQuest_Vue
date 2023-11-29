<script setup>
import {reactive} from 'vue'
import router from '../../router';
import axios from 'axios'
import {dto} from '@/stores/quest';
import {API_URL} from '@/stores/api';

const content = reactive({
    list: [],
    isLoading: false,
    state: 'PROCEED',
    panel: []
})

dto.reset()
getQuests(content.state)

function getQuests(state) {
    axios.get(`${ API_URL.QUEST_LIST_GET }?state=${state}`)
        .then((res) => {
            if (res) {
              content.list = res.data.data
            }
        }).finally(() => {
            content.isLoading = false
        })
}

function formatDateString(dateStr) {
    const split = dateStr.split('T')
    return split[0] + ' ' + split[1]
}

function canCompleteQuest(quest) {
    return quest.detailQuests.length === quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length
}

function interactDetailQuest(questId, detailId, questIndex, detailIndex, data = undefined) {
    
    axios.patch(API_URL.QUEST_DETAIL_UPDATE(questId, detailId), data)
        .then((res) => {
            const data = res.data.data
            content.list[questIndex].canComplete = data.canCompleteParent
            content.list[questIndex].detailQuests[detailIndex] = data

        })
}

function onRightClickInteractDetail(questId, detailId, questIndex, detailIndex) {

    const count = content.list[questIndex].detailQuests[detailIndex].count
    if (count === 0) return
    
    const data = {
        count: count - 1
    }

    interactDetailQuest(questId, detailId, questIndex, detailIndex, data)
}

function patchQuest(url, questId, questIndex) {
    axios.patch(url(questId))
        .then(() => {
            content.list.splice(questIndex, 1)
    })
}

function changeStateTab() {
    content.panel = [];
    getQuests(content.state)
}
</script>

<template>
    <VContainer class="w-33 h-75" id="test" style="min-width:min-content; margin-top:100px;">
        <div class="d-flex justify-center">
            <VTabs bg-color="white" color="black" v-model="content.state" hide-slider align-tabs="center" selected-class="selected-tab" class="ma-2 w-fit rounded">
                <VTab value="PROCEED" @click="changeStateTab">진행</VTab>
                <VTab value="COMPLETE" @click="changeStateTab">완료</VTab>
                <VTab value="DISCARD" @click="changeStateTab">포기</VTab>
                <VTab value="FAIL" @click="changeStateTab">실패</VTab>
            </VTabs>
        </div>
        <VExpansionPanels v-model="content.panel" multiple variant="inset" class="align-center pb-2" style="min-width:400px;">
            <div v-if="content.list.length === 0">등록된 퀘스트가 없습니다.</div>
            <VExpansionPanel v-for="(quest, qIndex) in content.list" :key="qIndex" :value="qIndex">
                <VExpansionPanelTitle>
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
                    <VChip v-if="quest.detailQuests.length > 0" label :color="canCompleteQuest(quest) ? 'green' : ''" class="float-right me-2">{{ quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length + '/' + quest.detailQuests.length }}</VChip>
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
                                        @click.prevent="interactDetailQuest(quest.id, detail.id, qIndex, dIndex)"
                                        >
                                    </VCheckboxBtn>
                                    <VBtn 
                                        v-if="detail.type === 'COUNT'"
                                        rounded="lg" size="small"
                                        class="my-1"
                                        @click="interactDetailQuest(quest.id, detail.id, qIndex, dIndex)"
                                        @contextmenu.prevent="onRightClickInteractDetail(quest.id, detail.id, qIndex, dIndex)"
                                        >
                                        {{ detail.count + '/' + detail.targetCount }}
                                    </VBtn>
                                </div>
                            </template>
                        </VListItem>
                    </div>
                    <VRow v-if="quest.state === 'PROCEED'">
                        <VCol cols="8">
                            <VBtn rounded="lg" size="small" class="ma-2"
                            @click="dto.set(quest); router.push(`/quests/${quest.id}`)"
                            >수정</VBtn>
                            <VBtn rounded="lg" size="small" class="ma-2"
                            @click="patchQuest(API_URL.QUEST_DISCARD, quest.id, qIndex)"
                            >포기</VBtn>
                        </VCol>
                        <VCol cols="4" class="d-flex justify-end">
                            <VBtn v-if="quest.canComplete" rounded="lg" size="small" class="ma-2"
                            @click="patchQuest(API_URL.QUEST_COMPLETE, quest.id, qIndex)"
                            >완료</VBtn>
                        </VCol>
                    </VRow>
                </VExpansionPanelText>
            </VExpansionPanel>
        </VExpansionPanels>
    </VContainer>
    <RouterLink to="/quests/save" class="position-fixed ma-10" style="bottom:0; right:0;">
        <VBtn icon="mdi-plus" size="small"/>
    </RouterLink>
</template>

<style>
.selected-tab {
    background-color: lightgray;
}
</style>