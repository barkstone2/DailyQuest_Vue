<script setup>
import {ref} from "vue";
import LoadingLayer from "@/components/common/LoadingLayer.vue";

defineProps({
  list: Array,
  totalPages: Number,
  emptyMessage: String,
  isLoading: Boolean,
});

const page = ref(1)

defineEmits(
    ['update:page']
)

function canCompleteQuest(quest) {
  return quest.detailQuests.length === quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length
}

</script>

<template>
  <div style="border-radius: 2px;" class="pa-1">
    <LoadingLayer v-if="isLoading"></LoadingLayer>
    <div v-if="list.length === 0">{{ emptyMessage }}</div>
    <VExpansionPanels v-else v-for="(quest, qIndex) in list" :key="qIndex" :value="qIndex">
      <VExpansionPanel>
        <VExpansionPanelTitle>
          <VRow class="align-center">
            <VCol cols="8">
              <VRow>
                <VCol cols="12" class="pa-1">
                  <span class="ma-1 font-weight-bold">{{ '#' + quest.seq }}</span>
                  <VChip class="ma-1 font-weight-bold" label size="small" color="primary" v-if="quest.type === 'MAIN'">메인</VChip>
                  <VChip class="ma-1 font-weight-bold" label size="small" color="secondary" v-else>서브</VChip>

                  <VChip class="ma-1 font-weight-bold" label size="small" color="indigo" v-if="quest.state === 'PROCEED'">진행중</VChip>
                  <VChip class="ma-1 font-weight-bold" label size="small" color="green" v-else-if="quest.state === 'COMPLETE'">완료</VChip>
                  <VChip class="ma-1 font-weight-bold" label size="small" v-else-if="quest.state === 'DISCARD'">포기</VChip>
                  <VChip class="ma-1 font-weight-bold" label size="small" color="red" v-else-if="quest.state === 'FAIL'">실패</VChip>
                </VCol>
                <VCol cols="12" class="pa-1">
                  <span class="ma-1 font-weight-bold">{{ quest.title }}</span>
                </VCol>
                <VCol cols="12" class="pa-1">
                  <VChip class="ma-1 font-weight-bold" label size="small" color="yellow-darken-4" v-if="!!quest.deadLine">마감기한 : {{ quest.deadLine }}</VChip>
                </VCol>
              </VRow>
            </VCol>
            <VCol>
              <div>
                {{ quest.createdDate }}
              </div>
            </VCol>
            <VCol cols="1">
              <VChip v-if="quest.detailQuests.length > 0" label :color="canCompleteQuest(quest) ? 'green' : ''">{{ quest.detailQuests.filter((detail) => detail.state === 'COMPLETE').length + '/' + quest.detailQuests.length }}</VChip>
            </VCol>
          </VRow>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="pb-2" style="white-space: pre-wrap;">{{ quest.description }}</div>
          <div v-for="(detail, dIndex) in quest.detailQuests" :key="dIndex">
            <VListItem active class="rounded ma-2">
              <VListItemTitle class="text-wrap">{{ detail.title }}</VListItemTitle>
              <template #append>
                <div style="height:40px; width:64px" class="d-flex align-center justify-center ps-2">
                  <VCheckboxBtn
                      v-if="detail.type === 'CHECK'"
                      :model-value="detail.state === 'COMPLETE'"
                      readonly
                  >
                  </VCheckboxBtn>
                  <VBtn
                      v-if="detail.type === 'COUNT'"
                      rounded="lg" size="small"
                      class="my-1"
                  >
                    {{ detail.count + '/' + detail.targetCount }}
                  </VBtn>
                </div>
              </template>
            </VListItem>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <VPagination v-if="totalPages > 0" v-model="page" @click="$emit('update:page', page)" :length="totalPages" :total-visible="6" :show-first-last-page=true></VPagination>
  </div>
</template>
<style scoped>
</style>