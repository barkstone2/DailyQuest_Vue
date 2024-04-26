<script setup>
import axios from 'axios'
import router from '../router';
import { PRINCIPAL } from '@/stores/principal';
import { ref, reactive } from 'vue';
import { API_CONFIG, API_URL } from '@/stores/api';

const dto = reactive({
  nickname: PRINCIPAL.nickname,
  coreTimeHour: PRINCIPAL.coreTimeHour
})

function hours() {
  return Array.from({length: 24}, (_, i) => i)
}

function isValidNickname() {
  const regex = API_CONFIG.NICKNAME_VALIDATION_REGEX
  return regex.test(dto.nickname)
}

const form = ref(null)

async function updateUserSettings() {
  const {valid} = await form.value.validate()
  if (valid) {
    axios.patch(API_URL.USER_UPDATE, dto)
        .then(() => {
          PRINCIPAL.synchronize()
              .then(() => {
                alert('변경 완료')
              })
        })
  }
}

</script>
<template>
  <VContainer class="w-75">
    <div class="d-flex justify-center">
      <VForm class="w-50" style="min-width:400px" fast-fail @submit.prevent ref="form">
        <VTextField
            clearable
            class="mb-1"
            v-model="dto.nickname"
            label="닉네임"
            :rules="[
                            () => !!dto.nickname || '닉네임은 반드시 입력해야 합니다.',
                            () => isValidNickname() || '닉네임은 2~20자의 영어, 숫자, 한글이어야 해요.',
                        ]"
        >
        </VTextField>
        <VSelect
            v-model="dto.coreTimeHour"
            label="코어타임"
            class="mb-1"
            :items="hours()"
            :item-title="(item) => `${item}~${item+1}시`"
            :item-value="(item) => item"
            :readonly="!PRINCIPAL.canUpdateCoreTime"
            :messages="!PRINCIPAL.canUpdateCoreTime ? ['변경 후 24시간이 지나야 변경할 수 있어요.', `다음 변경까지 : ${PRINCIPAL.remainTimeUntilToUpdateCoreTime}`] : ''"
        >
        </VSelect>
        <div class="d-flex justify-center py-3">
          <VBtn type="submit" rounded="lg" class="ma-5" @click="updateUserSettings">저장</VBtn>
          <VBtn rounded="lg" class="ma-5" @click="router.go(-1)">취소</VBtn>
        </div>
      </VForm>
    </div>
  </VContainer>
</template>
