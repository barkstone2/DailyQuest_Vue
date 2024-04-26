<script setup>
import {inject, ref} from "vue";
import axios from "axios";
import {API_URL} from "@/stores/api";
import {dto} from "@/stores/preferenceQuest";

const closePrefQuestSaveDialog = inject('closePrefQuestSaveDialog');
const getPrefQuestList = inject('getPrefQuestList');

function appendDetailRow() {
  dto.details.push({
    id: 0,
    title: '',
    type: 'CHECK',
    targetCount: 1,
    count: 0,
  });
}

const form = ref(null)

async function savePreferenceQuest() {

  const {valid} = await form.value.validate()
  if (valid) {
    if (dto.id) {
      axios.patch(API_URL.PREFERENCE_QUEST.UPDATE(dto.id), dto)
          .then(() => {
            alert('수정이 완료되었습니다.')
            getPrefQuestList()
            closePrefQuestSaveDialog()
          })
    } else {
      axios.post(API_URL.PREFERENCE_QUEST.SAVE, dto)
          .then(() => {
            alert('등록이 완료되었습니다.')
            getPrefQuestList()
            closePrefQuestSaveDialog()
          })
    }
  }
}
</script>
<template>
  <div class="d-flex justify-center">
    <VCard class="pa-2 w-50 overflow-auto" elevation="8" max-height="600">
      <VCardTitle>선호 퀘스트 등록</VCardTitle>
      <VCardText>
        <VForm style="min-width:400px" fast-fail @submit.prevent ref="form">
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
          <VCard class="px-3 pb-2" rounded="rounded-sm" variant="outlined">
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
        </VForm>
      </VCardText>
      <VCardActions class="d-flex justify-center">
        <VBtn rounded="lg" class="ma-2" @click="savePreferenceQuest()">저장</VBtn>
        <VBtn rounded="lg" class="ma-2" @click="closePrefQuestSaveDialog()">취소</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>