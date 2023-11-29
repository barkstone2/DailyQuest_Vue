<script setup>
import { PRINCIPAL } from '@/stores/principal';
import { ref } from 'vue';

const tab = ref(null)

</script>
<style>
.block {
    background-color: #f7f8f9;
    border-radius: 8px;
    color: black;
    padding: 8px !important;
}
</style>


<template>
    <VContainer class="w-75 h-75" style="margin-top:100px;">

        <VRow>
            <VCol cols="12">
                <div class="block">
                    <div class="py-2">
                        <span class="font-weight-bold text-h5">{{ PRINCIPAL.nickname }}</span>
                        <span class="pl-3">LEVEL {{ PRINCIPAL.level }} (다음 레벨까지 {{ PRINCIPAL.requireExp - PRINCIPAL.currentExp }} EXP)</span>
                    </div>
                    <div>
                        <VProgressLinear :model-value="PRINCIPAL.currentExp" :max="PRINCIPAL.requireExp" color="green" height="25px" style="border-radius: 5px;">
                            {{ PRINCIPAL.currentExp }} / {{ PRINCIPAL.requireExp }} ({{ Math.ceil(PRINCIPAL.currentExp / PRINCIPAL.requireExp * 100) }}%)
                        </VProgressLinear>
                    </div>
                    <div>
                        <!-- 골드 아이콘 -->
                        {{ PRINCIPAL.gold }} GOLD
                    </div>
                    <div>
                        <div>
                            총 등록한 퀘스트 수 30
                        </div>
                        <div>
                            총 완료한 퀘스트 수 15
                        </div>
                        <div>
                            총 포기한 퀘스트 수 3
                        </div>
                        <div>
                            총 실패한 퀘스트 수 5
                        </div>
                    </div>
                </div>
                <div>
                    <VTabs bg-color="white" color="black" v-model="tab" hide-slider align-tabs="center" selected-class="selected-tab" class="mt-2 w-fit rounded-lg">
                        <RouterLink to="/status" style="color: black;">
                            <VTab value="statistics">통계</VTab>
                        </RouterLink>
                        <RouterLink to="/status/history" style="color: black;">
                            <VTab value="quest-history">퀘스트 기록</VTab>
                        </RouterLink>
                    </VTabs>
                </div>
            </VCol>
            <VCol cols="12">
                <RouterView></RouterView>
            </VCol>
        </VRow>
    </VContainer>
</template>
<style>
.selected-tab {
    background-color: lightgray;
}
</style>