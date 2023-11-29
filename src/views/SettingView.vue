<script setup>
import axios from 'axios'
import router from '../router';
import { principal } from '@/stores/principal';
import { ref, reactive } from 'vue';
import { API_CONFIG, API_URL } from '@/stores/api';

const dto = reactive({
    nickname: principal.nickname,
    resetTime: principal.resetTime,
    coreTime: principal.coreTime
})

function hours() {
    return Array.from({ length: 24 }, (_, i) => i)
}

function isValidNickname() {
    const regex = API_CONFIG.NICKNAME_VALIDATION_REGEX

    return regex.test(dto.nickname)
}

const form = ref(null)

async function requestSettings() {

    const { valid } = await form.value.validate()
    if (valid) {
        axios.patch(API_URL.USER_UPDATE, dto)
            .then((res) => {
                // 유저정보 업데이트
                principal.synchronize(true).then((res) => {
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
                    <VTextField clearable 
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
                        v-model="dto.resetTime"
                        label="초기화 시간"
                        class="mb-1"
                        :items="hours()"
                        :item-title="(item) => `${item}시`"
                        :item-value="(item) => item"
                        :readonly="!principal.canUpdateResetTime"
                        :messages="!principal.canUpdateResetTime ? ['변경 후 24시간이 지나야 변경할 수 있어요.', `다음 변경까지 : ${principal.remainTimeUntilToUpdateResetTime}`] : ''"
                    >
                    </VSelect>
                    <VSelect
                        v-model="dto.coreTime"
                        label="코어타임"
                        class="mb-1"
                        :items="hours()"
                        :item-title="(item) => `${item}~${item+1}시`"
                        :item-value="(item) => item"
                        :readonly="!principal.canUpdateCoreTime"
                        :messages="!principal.canUpdateCoreTime ? ['변경 후 24시간이 지나야 변경할 수 있어요.', `다음 변경까지 : ${principal.remainTimeUntilToUpdateCoreTime}`] : ''"
                    >
                    </VSelect>
                    <div class="d-flex justify-center py-3">
                        <VBtn type="submit" rounded="lg" class="ma-5" @click="requestSettings">저장</VBtn>
                        <VBtn rounded="lg" class="ma-5" @click="router.go(-1)">취소</VBtn>
                    </div>
                </VForm>
            </div>
        </VContainer>
</template>
