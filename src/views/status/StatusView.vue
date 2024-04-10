<script setup>
import axios from 'axios'
import { PRINCIPAL } from '@/stores/principal';
import {computed, reactive, ref} from 'vue';
import { API_URL } from '@/stores/api';
import LoadingLayer from "@/components/common/LoadingLayer.vue";

const statusLoading = ref(true)
const tab = ref(null)

const totalStatistics = reactive({
  registeredCount: 0,
  completedCount: 0,
  discardedCount: 0,
  failedCount: 0,
  completeRatio: computed(() => Math.round(totalStatistics.completedCount * 100 / totalStatistics.registeredCount))
})

axios
    .get(`${API_URL.STATUS}`)
    .then((res) => {
      if (res) {
        const data = res.data.data
        totalStatistics.registeredCount = data.registeredCount
        totalStatistics.completedCount = data.completedCount
        totalStatistics.discardedCount = data.discardedCount
        totalStatistics.failedCount = data.failedCount
        statusLoading.value = false
      }
    })

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
                  <LoadingLayer v-if="statusLoading"></LoadingLayer>
                    <div class="py-2">
                        <span class="font-weight-bold text-h5">{{ PRINCIPAL.nickname }}</span>
                        <span class="pl-3">LEVEL {{ PRINCIPAL.level }} (다음 레벨까지 {{ PRINCIPAL.requireExp - PRINCIPAL.currentExp }} EXP)</span>
                    </div>
                    <div>
                        <VProgressLinear :model-value="PRINCIPAL.currentExp" :max="PRINCIPAL.requireExp" color="green" height="25px" style="border-radius: 5px;">
                            {{ PRINCIPAL.currentExp }} / {{ PRINCIPAL.requireExp }} ({{ Math.ceil(PRINCIPAL.currentExp / PRINCIPAL.requireExp * 100) }}%)
                        </VProgressLinear>
                    </div>
                    <div class="d-flex align-center py-3">
                      <img alt="gold coin image" src="@/assets/gold-coin.png" style="width: 39px; height:40px"/>
                      <div class="ps-2"> X {{ PRINCIPAL.gold }}</div>
                    </div>
                    <div>
                        <div>
                            총 등록한 퀘스트 수 - {{ totalStatistics.registeredCount }}
                        </div>
                        <div>
                            총 완료한 퀘스트 수 - {{ totalStatistics.completedCount }} (완료율 {{ totalStatistics.completeRatio }}%)
                        </div>
                        <div>
                            총 포기한 퀘스트 수 - {{ totalStatistics.discardedCount }}
                        </div>
                        <div>
                            총 실패한 퀘스트 수 - {{ totalStatistics.failedCount }}
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
                        <RouterLink to="/status/achievements" style="color: black;">
                          <VTab value="achievements">업적</VTab>
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