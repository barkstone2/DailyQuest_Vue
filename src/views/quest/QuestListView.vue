<script setup>
import {reactive} from 'vue'
import router from '../../router';
import axios from 'axios'
import {dto} from '@/stores/quest';
import {API_URL} from '@/stores/api';
import LoadingLayer from "@/components/common/LoadingLayer.vue";
import QuestTypeChip from "@/views/quest/components/QuestTypeChip.vue";
import QuestStateChip from "@/views/quest/components/QuestStateChip.vue";

const content = reactive({
  list: [],
  isLoading: true,
  state: 'PROCEED',
  panel: []
})

dto.reset()
getQuests(content.state)

function getQuests(state) {
  content.isLoading = true
  axios.get(`${API_URL.QUEST_LIST_GET}?state=${state}`)
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
        if (res) {
          const data = res.data.data
          content.list[questIndex].canComplete = data.canCompleteParent
          content.list[questIndex].detailQuests[detailIndex] = data
        }
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
      <VTabs bg-color="white" color="black" v-model="content.state" hide-slider align-tabs="center"
             selected-class="selected-tab" class="ma-2 w-fit rounded">
        <VTab value="PROCEED" @click="changeStateTab" rounded text="진행"/>
        <VTab value="COMPLETE" @click="changeStateTab" rounded text="완료"/>
        <VTab value="DISCARD" @click="changeStateTab" rounded text="포기"/>
        <VTab value="FAIL" @click="changeStateTab" rounded text="실패"/>
      </VTabs>
    </div>
    <VExpansionPanels v-model="content.panel" multiple variant="inset" class="align-center pb-2"
                      style="min-width:400px;">
      <LoadingLayer v-if="content.isLoading"></LoadingLayer>
      <div v-if="content.list.length === 0">등록된 퀘스트가 없습니다.</div>
      <VExpansionPanel v-for="(quest, qIndex) in content.list" :key="qIndex" :value="qIndex">
        <VExpansionPanelTitle>
          <VRow>
            <VCol cols="12" class="pa-1">
              <span class="ma-1 font-weight-bold">{{ '#' + quest.seq }}</span>
              <QuestTypeChip :quest-type="quest.type"/>
              <QuestStateChip :quest-state="quest.state"/>
            </VCol>
            <VCol cols="12" class="pa-1">
              <span class="ma-1 font-weight-bold">{{ quest.title }}</span>
            </VCol>
            <VCol cols="12" class="pa-1">
              <VChip v-if="!!quest.deadLine"
                     class="ma-1 font-weight-bold" size="small" color="yellow-darken-4"
                     :text="'마감기한 : ' + formatDateString(quest.deadLine)"/>
            </VCol>
          </VRow>
          <VChip v-if="quest.detailQuests.length > 0"
                 class="float-right me-2" :color="canCompleteQuest(quest) ? 'green' : ''"
                 :text="quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length + '/' + quest.detailQuests.length"/>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="pb-2" style="white-space: pre-wrap;">{{ quest.description }}</div>
          <div v-for="(detail, dIndex) in quest.detailQuests" :key="dIndex">
            <VListItem active class="rounded ma-2">
              <VListItemTitle class="text-wrap">{{ detail.title }}</VListItemTitle>
              <template #append>
                <div style="height:40px; width:64px" class="d-flex align-center justify-center ps-2">
                  <VCheckboxBtn v-if="detail.type === 'CHECK'"
                      class="justify-center"
                      :model-value="detail.state === 'COMPLETE'"
                      @click.prevent="interactDetailQuest(quest.id, detail.id, qIndex, dIndex)"
                  />
                  <VBtn v-if="detail.type === 'COUNT'"
                      class="my-1" rounded="lg" size="small"
                      @click="interactDetailQuest(quest.id, detail.id, qIndex, dIndex)"
                      @contextmenu.prevent="onRightClickInteractDetail(quest.id, detail.id, qIndex, dIndex)"
                      :text="detail.count + '/' + detail.targetCount"/>
                </div>
              </template>
            </VListItem>
          </div>
          <VRow v-if="quest.state === 'PROCEED'">
            <VCol cols="8">
              <VBtn rounded="lg" size="small" class="ma-2"
                    @click="dto.set(quest); router.push(`/quests/${quest.id}`)"
                    text="수정"/>
              <VBtn rounded="lg" size="small" class="ma-2"
                    @click="patchQuest(API_URL.QUEST_DISCARD, quest.id, qIndex)"
                    text="포기"/>
            </VCol>
            <VCol cols="4" class="d-flex justify-end">
              <VBtn v-if="quest.canComplete" rounded="lg" size="small" class="ma-2"
                    @click="patchQuest(API_URL.QUEST_COMPLETE, quest.id, qIndex)"
                    text="완료"/>
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