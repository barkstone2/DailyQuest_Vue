<script setup>
import axios from 'axios';
import {ref} from 'vue';
import {API_URL} from '@/stores/api';
import router from '@/router';
import {dto} from '@/stores/quest';
import {PRINCIPAL} from "@/stores/principal";
import dateUtil from "@/utils/dateUtil";
import LoadingLayer from "@/components/common/LoadingLayer.vue";

getQuest();

function getQuest() {
  let routerValue = router.currentRoute.value;
  if (routerValue.name === 'questUpdate' && dto.id === null) {
    dto.isLoading = true
    axios.get(`${API_URL.QUEST_INFO(routerValue.params['questId'])}`)
        .then((res) => {
          if (res) {
            dto.set(res.data.data)
          }
        }).finally(() => {
      dto.isLoading = false
    })
  }
}

function appendDetailRow() {
  dto.details.push({
    id: 0,
    title: '',
    type: 'CHECK',
    targetCount: 1,
    count: 0,
  });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

const form = ref(null)

async function requestQuest() {

  const {valid} = await form.value.validate()
  if (valid) {
    if (dto.id) {
      axios.patch(API_URL.QUEST_UPDATE(dto.id), dto)
          .then(() => {
            router.push('/quests')
          })
    } else {
      axios.post(API_URL.QUEST_SAVE, dto)
          .then(() => {
            router.push('/quests')
          })
    }
  }
}

</script>

<template>
  <VContainer class="w-75 h-75">
    <div class="d-flex justify-center">
      <VForm class="w-50" style="min-width:400px" fast-fail @submit.prevent ref="form">
        <LoadingLayer v-if="dto.isLoading"></LoadingLayer>
        <VTextField clearable autofocus counter="50" persistent-counter
                    class="mb-1"
                    v-model="dto.title"
                    label="퀘스트 제목"
                    :rules="[
                        () => !!dto.title || '퀘스트 제목은 반드시 입력해야 합니다.',
                        () => dto.title.length <= 50 || '퀘스트 제목은 50자를 넘을 수 없습니다.'
                    ]"
        >
        </VTextField>
        <VTextarea clearable auto-grow counter="300" persistent-counter
                   class="mb-1"
                   v-model="dto.description"
                   label="퀘스트 설명"
                   :rules="[
                        () => dto.description.length <= 300 || '퀘스트 설명은 300자를 넘을 수 없습니다.'
                    ]"
        >
        </VTextarea>
        <VTextField
            class="mb-1"
            v-model="dto.deadLine"
            label="마감기한"
            type="datetime-local"
            :min="formatDate(new Date(new Date().getTime() + PRINCIPAL.resetTimeDelayMs))"
            :max="formatDate(new Date(PRINCIPAL.nextResetTime.getTime() - PRINCIPAL.resetTimeDelayMs))"
            :rules="[
                        () => (!dto.deadLine || new Date(dto.deadLine).getTime() > new Date().getTime() + PRINCIPAL.resetTimeDelayMs) || '선택하지 않거나 현재 시간 + 10분 이후의 시간을 선택해야 합니다.',
                        () => (!dto.deadLine || new Date(dto.deadLine).getTime() < PRINCIPAL.nextResetTime.getTime() - PRINCIPAL.resetTimeDelayMs) || '선택하지 않거나 다음 초기화 시간보다 10분 앞선 시간을 선택해야 합니다. 다음 초기화 시간 : ' + dateUtil.getDateTimeStr(PRINCIPAL.nextResetTime)
                    ]"
        >
        </VTextField>

        <VCard class="px-3 bg-grey-darken-4 pb-2" rounded="rounded-sm">
          <div class="d-flex align-center pt-2 ps-1">
            <VLabel class="pe-2">세부 퀘스트</VLabel>
            <VBtn v-if="dto.details.length < 5" @click="appendDetailRow" variant="plain" icon="true" size="small"
                  style="z-index: 100;">
              <VIcon color="green" icon="mdi-plus" size="x-large"/>
            </VBtn>
          </div>
          <VRow v-for="(detail, index) in dto.details" :key="index" class="pt-3">
            <VCol xxl="" xl="" cols="12">
              <VTextField counter="50" persistent-counter
                          v-model="detail.title"
                          label="세부 퀘스트 제목"
                          :rules="[
                                    () => !!detail.title || '세부 퀘스트 제목은 반드시 입력해야 합니다.',
                                    () => !!detail.title && detail.title.length <= 50 || '세부 퀘스트 제목은 최대 50자까지 입력할 수 있습니다.'
                                ]"
              >
              </VTextField>
            </VCol>
            <VCol v-if="detail.type === 'COUNT'" xxl="2" xl="2">
              <VTextField
                  v-model="detail.targetCount"
                  label="목표 횟수"
                  type="number" min="1" max="255"
                  :rules="[
                                () => (detail.targetCount > 0 && detail.targetCount <=255) || '목표횟수는 1~255 사이의 값이어야 합니다.'
                            ]">
              </VTextField>
            </VCol>
            <VCol xxl="3" xl="4">
              <VSelect
                  v-model="detail.type"
                  label="타입"
                  :items="[
                                    { title: '체크박스', value: 'CHECK' },
                                    { title: '카운트', value: 'COUNT' }
                                ]"
                  :rules="[
                                    () => !!detail.type || '타입은 반드시 선택해야 합니다.'
                                ]"
              >
                <template #append>
                  <VBtn @click="dto.details.splice(index, 1)" variant="plain" icon="true" size="small">
                    <VIcon color="red" icon="mdi-close" size="x-large"/>
                  </VBtn>
                </template>
              </VSelect>
            </VCol>
            <VDivider/>
          </VRow>
        </VCard>
        <div class="d-flex justify-center py-3">
          <VBtn type="submit" rounded="lg" class="ma-5" @click="requestQuest">저장</VBtn>
          <VBtn rounded="lg" class="ma-5" @click="router.push('/quests')">취소</VBtn>
        </div>
      </VForm>
    </div>
  </VContainer>
</template>