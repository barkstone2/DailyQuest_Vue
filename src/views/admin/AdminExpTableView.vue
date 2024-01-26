<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { admin } from '@/stores/admin';
import { API_URL } from '@/stores/api';

const form = ref(null)

async function requestExpTable() {

    const { valid } = await form.value.validate()
    if (valid) {
        axios.put(API_URL.ADMIN_EXP_TABLE_UPDATE, admin.expTable, {baseURL: admin.baseURL})
            .then((res) => {
              if(res) {
                alert('변경 완료')
              }
            })
    }
}

const lastLevelRule = (value) => {
    return value > 0 ? true : '마지막 레벨의 경험치만 0이 될 수 있습니다.'
}

const requireRule = (value) => {
    return value >= 0 ? true : '양수값을 반드시 입력해야 합니다.'
}

</script>

<template>
    <VContainer class="w-75 h-100">
        <div class="d-flex justify-center h-100">
            <VForm class="w-25" style="min-width:400px" fast-fail @submit.prevent ref="form">
                <VRow dense style="overflow:auto;" class="h-100" id="scrollRow">
                    <template v-for="(requireExp, level) in admin.expTable" :key="level">
                        <VCol cols="6">
                            <VTextField
                                label="레벨" 
                                type="number"
                                :value="level"
                                readonly
                                density="compact"
                                dirty
                                hide-details="auto"
                                style="pointer-events: none;"
                            >
                            </VTextField>
                        </VCol>
                        <VCol cols="6">
                            <VTextField 
                            v-model="admin.expTable[level]"
                            label="필요 경험치" 
                            type="number"
                            min="0"
                            :style="admin.isLastLevel(level) ? 'pointer-events: none;' : ''"
                            :readonly=admin.isLastLevel(level)
                            :rules="[
                                requireRule,
                                !admin.isLastLevel(level) ? lastLevelRule : true,
                            ]"
                                density="compact"
                                hide-details="auto"
                            >
                            </VTextField>
                        </VCol>
                    </template>
                </VRow>
                <div class="d-flex justify-center py-3">
                    <VBtn type="submit" rounded="lg" class="ma-5" @click="admin.addNewLevel()">추가</VBtn>
                    <VBtn type="submit" rounded="lg" class="ma-5" @click="admin.deleteLastLevel()">제거</VBtn>
                    <VBtn type="submit" rounded="lg" class="ma-5" @click="requestExpTable()">저장</VBtn>
                </div>
            </VForm>
        </div>

    </VContainer>
</template>