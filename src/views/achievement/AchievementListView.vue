<script setup>

import axios from "axios";
import {API_URL} from "@/stores/api";
import {reactive, ref, watch} from "vue";
import LoadingLayer from "@/components/common/LoadingLayer.vue";

const content = reactive({
  list: [],
  page: 1,
  totalPages: 0,
  isLoading: true,
})

function getAchievedList() {
  axios
      .get(`${API_URL.ACHIEVEMENT.ACHIEVED_LIST}?page=${content.page-1}`)
      .then((res) => {
        if (res) {
          const data = res.data.data;
          content.list = data.content
          content.totalPages = data.totalPages
          content.page = data.number+1
          content.isLoading = false
        }
      })
}

function getNotAchievedList() {
  axios
      .get(`${API_URL.ACHIEVEMENT.NOT_ACHIEVED_LIST}?page=${content.page-1}`)
      .then((res) => {
        if (res) {
          const data = res.data.data;
          content.list = data.content
          content.totalPages = data.totalPages
          content.page = data.number+1
          content.isLoading = false
        }
      })
}

getAchievedList()

function getAchievements() {
  content.isLoading = true
  if (selectedTab.value === 'ACHIEVED') {
    getAchievedList()
  } else {
    getNotAchievedList()
  }
}

const selectedTab = ref('ACHIEVED')

watch(selectedTab, () => {
  content.page = 1
  getAchievements()
})

</script>

<template>

<div class="block">
  <VTabs bg-color="white" color="black" v-model="selectedTab" hide-slider align-tabs="center"
         selected-class="selected-tab" class="ma-2 w-fit rounded-lg border">
    <VTab value="ACHIEVED" rounded>달성한 업적</VTab>
    <VTab value="NOT_ACHIEVED" rounded>달성하지 못한 업적</VTab>
  </VTabs>
  <VList>
    <LoadingLayer v-if="content.isLoading"></LoadingLayer>
    <VListItem>
      <VRow align="center">
        <VCol cols="9">업적</VCol>
        <VCol v-if="selectedTab === 'ACHIEVED'">달성일</VCol>
        <VCol v-else>달성 조건</VCol>
      </VRow>
    </VListItem>
    <VDivider/>
    <VListItem v-for="(achievement, index) in content.list" :key="index">
      <VRow align="center">
        <VCol cols="9">
          <div>{{ achievement.title }}</div>
          <div class="text-grey-darken-1">{{ achievement.description }}</div>
        </VCol>
        <VCol v-if="selectedTab === 'ACHIEVED'">
          <div>
            {{ achievement.achievedDate }}
          </div>
        </VCol>
        <VCol v-else>
          <div>
            {{ achievement.targetMessage }}
          </div>
        </VCol>
      </VRow>
      <VDivider/>
    </VListItem>
  </VList>
  <VPagination v-if="content.totalPages > 0" v-model="content.page" @click="getAchievements" :length="content.totalPages" :total-visible="8" :show-first-last-page=true></VPagination>
</div>
</template>