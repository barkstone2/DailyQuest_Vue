<script setup>
import router from '@/router';

</script>
<template>
    <VContainer class="h-50 w-50">
        <VContainer class="h-50 d-flex">
            <VRow class="align-self-center justify-center">
                <VCol class="v-col-12 text-center">
                    <h1>페이지를 찾을 수 없습니다.</h1>
                </VCol>
                <VCol class="v-col-12 text-center d-flex justify-center">
                    <VBtn rounded="lg" @click="router.go(-1)">
                        뒤로 가기
                    </VBtn>
                </VCol>
            </VRow>
        </VContainer>
    </VContainer>
</template>