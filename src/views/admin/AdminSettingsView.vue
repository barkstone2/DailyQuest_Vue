<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { admin } from '@/stores/admin'
import { API_URL } from '@/stores/api';

const form = ref(null)

async function requestSettings() {

    const { valid } = await form.value.validate()
    if (valid) {
        axios.put(API_URL.ADMIN_SETTING_UPDATE, admin.settings, {baseURL: admin.baseURL})
            .then((res) => {
              if(res) {
                alert('변경 완료')
              }
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
                    type="number"
                    v-model="admin.settings.questClearExp" 
                    label="퀘스트 클리어 경험치" 
                    min="0"
                    :rules="[
                            () => !!admin.settings.questClearExp || '필수 입력 값입니다.',
                        ]"
                >
                </VTextField>
                <VTextField clearable 
                    class="mb-1"
                    type="number"
                    v-model="admin.settings.questClearGold" 
                    label="퀘스트 클리어 골드"
                    min="0"
                    :rules="[
                            () => !!admin.settings.questClearGold || '필수 입력 값입니다.',
                        ]"
                >
                </VTextField>
                <VTextField clearable 
                    class="mb-1"
                    type="number"
                    v-model="admin.settings.maxRewardCount" 
                    label="일일 보상 획득 횟수" 
                    min="0"
                    :rules="[
                            () => !!admin.settings.maxRewardCount || '필수 입력 값입니다.',
                        ]"
                >
                </VTextField>
                
                <div class="d-flex justify-center py-3">
                    <VBtn type="submit" rounded="lg" class="ma-5" @click="requestSettings">저장</VBtn>
                </div>
            </VForm>
        </div>
    </VContainer>
</template>