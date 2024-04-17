<script setup>
import {computed} from 'vue';
import { admin } from '@/stores/admin';
import router from "@/router";

const tab = computed(() => router.currentRoute.value.name)
admin.getSettings()

</script>

<template>
    <VContainer class="w-75 h-75">
        <div class="d-flex justify-center">
            <VTabs bg-color="white" color="black" v-model="tab" hide-slider align-tabs="center" selected-class="selected-tab" class="ma-2 w-fit rounded-lg">
                <RouterLink to="/admin" style="color: black;">
                    <VTab value="system">시스템 설정</VTab>
                </RouterLink>
                <RouterLink to="/admin/exp-table" style="color: black;">
                    <VTab value="exp-table">경험치 테이블 관리</VTab>
                </RouterLink>
            </VTabs>
        </div>
        <RouterView></RouterView>
    </VContainer>
</template>

<style scoped>
.selected-tab {
    background-color: lightgray;
}
</style>