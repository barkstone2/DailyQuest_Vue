<script setup>
import {inject, provide, reactive} from "vue";
import PreferenceQuestSaveView from "@/views/preference-quest/PreferenceQuestSaveView.vue";
import LoadingLayer from "@/components/common/LoadingLayer.vue";
import axios from "axios";
import {API_URL} from "@/stores/api";
import {dto} from "@/stores/preferenceQuest";

const closePreferenceDialog = inject('closePreferenceDialog');
const getQuestList = inject('getQuestList');

const layout = reactive({
  isLoading: true,
  saveDialogOpened: false,
  openSaveDialog: () => {
    dto.reset()
    layout.saveDialogOpened = true
  },
  openUpdateDialog: (preferenceQuest) => {
    dto.set(preferenceQuest)
    layout.saveDialogOpened = true
  },
  closePrefQuestSaveDialog: () => {
    layout.saveDialogOpened = false
  },
})

const preferenceQuestModel = reactive({
  list: [],
  state: 'PROCEED',
  dto: {
    id: null,
    title: '',
    description: '',
    preferenceDetailQuests: []
  },
  getList: () => {
    layout.isLoading = true
    axios.get(`${API_URL.PREFERENCE_QUEST.LIST}`)
        .then((res) => {
          if (res) {
            preferenceQuestModel.list = res.data.data
          }
        }).finally(() => {
      layout.isLoading = false
    })
  },
  registerQuest: (preferenceQuestId) => {
    axios.post(`${API_URL.PREFERENCE_QUEST.REGISTER_QUEST(preferenceQuestId)}`)
        .then((res) => {
          if (res) {
            alert('퀘스트 등록이 완료됐습니다.')
            getQuestList()
            closePreferenceDialog()
          }
        })
  },
  deletePreferenceQuest: (preferenceQuestId) => {
    if (confirm('삭제 시 복구가 불가능합니다. 정말 삭제하시겠습니까?')) {
      axios.patch(API_URL.PREFERENCE_QUEST.DELETE(preferenceQuestId))
          .then((res) => {
            if (res) {
              alert('삭제되었습니다.')
              preferenceQuestModel.getList()
            }
          })
    }
  }
});

provide('getPrefQuestList', preferenceQuestModel.getList)
provide('closePrefQuestSaveDialog', layout.closePrefQuestSaveDialog)
preferenceQuestModel.getList()
</script>
<template>
  <VCard>
    <VCardTitle>선호 퀘스트 관리</VCardTitle>
    <VCardSubtitle>{{ preferenceQuestModel.list.length }}개의 선호 퀘스트가 존재합니다.</VCardSubtitle>
    <VCardText>
      <VSheet>
        <VSlideGroup show-arrows>
          <VSlideGroupItem>
            <LoadingLayer v-if="layout.isLoading"/>
            <VCard v-if="preferenceQuestModel.list.length === 0" max-height="600" width="100%" elevation="6"
                   class="ma-2 pa-1 text-center align-content-center" title="등록된 선호 퀘스트가 없습니다."/>
            <VCard v-for="(prefQuest, prefQuestIndex) in preferenceQuestModel.list" :key="prefQuestIndex"
                   class="ma-2 pa-1"
                   elevation="6" width="350" max-height="600">
              <VCardTitle class="text-wrap">{{ prefQuest.title }}</VCardTitle>
              <VCardText>{{ prefQuest.description }}</VCardText>
              <VDivider/>
              <VCardItem>
                <VCardSubtitle>세부 퀘스트 목록</VCardSubtitle>
                <VList height="280">
                  <VListItem v-for="(prefDetail, prefDetailIndex) in prefQuest.preferenceDetailQuests"
                             :key="prefDetailIndex">
                    <VRow class="align-center border" style="font-size: 15px;">
                      <VCol cols="8">
                        {{ prefDetail.title }}
                      </VCol>
                      <VCol cols="4" class="text-center">
                        <VIcon v-if="prefDetail.type === 'CHECK'" icon="mdi-checkbox-outline"
                               size="30"
                               class="ma-1"/>
                        <VChip v-if="prefDetail.type === 'COUNT'" variant="outlined"
                               class="ml-1 px-1" rounded="lg" :text="'0/'+prefDetail.targetCount"/>
                      </VCol>
                    </VRow>
                    <VDivider v-if="prefDetailIndex !== preferenceQuestModel.list.length-1"/>
                  </VListItem>
                </VList>
              </VCardItem>
              <VDivider/>
              <VCardText>
                <div>등록일 : {{ prefQuest.createdDate }}</div>
                <div>마지막 수정일 : {{ prefQuest.lastModifiedDate }}</div>
                <div>등록한 횟수 : {{ prefQuest.usedCount }}</div>
              </VCardText>
              <VCardActions class="justify-center">
                <VBtn rounded="lg" class="ma-2" @click="preferenceQuestModel.registerQuest(prefQuest.id)">퀘스트 등록</VBtn>
                <VBtn rounded="lg" class="ma-2" @click="layout.openUpdateDialog(prefQuest)">수정</VBtn>
                <VBtn rounded="lg" class="ma-2" @click="preferenceQuestModel.deletePreferenceQuest(prefQuest.id)">삭제</VBtn>
              </VCardActions>
            </VCard>
          </VSlideGroupItem>
        </VSlideGroup>
      </VSheet>
    </VCardText>
    <VCardActions class="justify-end">
      <VBtn rounded="lg" size="small" class="ma-2" @click="layout.openSaveDialog()">선호 퀘스트 등록</VBtn>
      <VBtn rounded="lg" size="small" class="ma-2" @click="closePreferenceDialog">닫기</VBtn>
    </VCardActions>
  </VCard>
  <VDialog v-model="layout.saveDialogOpened">
    <PreferenceQuestSaveView v-if="layout.saveDialogOpened"/>
  </VDialog>
</template>