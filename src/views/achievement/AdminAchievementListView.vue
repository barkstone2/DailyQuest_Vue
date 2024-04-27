<script setup>
import {computed, reactive, ref, watch} from "vue";
import axios from "axios";
import {API_URL} from "@/stores/api";
import {admin} from "@/stores/admin";
import LoadingLayer from "@/components/common/LoadingLayer.vue";

const pageSize = 10
const page = ref(1)
const totalPages = computed(() => {
  const listOfType = content.achievementsMap[selectedType.value];
  if (listOfType === undefined) return 0
  return Math.ceil(listOfType.length / pageSize)
})
const selectedType = ref(null)
watch(selectedType, () => {
  page.value = 1
})

const content = reactive({
  types: [],
  achievementsMap: {},
  isLoading: true,
  pagedList: computed(() => {
    const listOfType = content.achievementsMap[selectedType.value];
    if (listOfType === undefined) return []
    return listOfType.slice((page.value - 1) * pageSize, page.value * pageSize)
  }),
})

function getAllAchievements() {
  content.isLoading = true
  axios
      .get(`${API_URL.ADMIN_ACHIEVEMENT_LIST}`, {
        baseURL: admin.baseURL
      })
      .then((res) => {
        if (res) {
          const data = res.data.data
          content.types = data.achievementTypes
          content.achievementsMap = data.achievements
          if (selectedType.value === null) {
            selectedType.value = content.types[0].key
          }
          content.isLoading = false
        }
      })
}

getAllAchievements()

const update = {
  id: null,
  dto: reactive({
    title: '',
    description: '',
  }),
  targetIndex: null,
  form: ref(null),
  submit: async () => {
    const { valid } = await update.form.value.validate()
    if (valid) {
      axios.patch(API_URL.ADMIN_ACHIEVEMENT_UPDATE(update.id), update.dto, {
        baseURL: admin.baseURL
      })
          .then(() => {
            update.closeDialog()
            content.pagedList[update.targetIndex].title = update.dto.title
            content.pagedList[update.targetIndex].description = update.dto.description
            alert('수정이 완료되었습니다.')
          })
    }
  },
  dialogOpened: ref(false),
  openDialog: (targetIndex) => {
    Object.assign(update.dto, content.pagedList[targetIndex])
    update.id = content.pagedList[targetIndex].id
    update.targetIndex = targetIndex
    update.dialogOpened.value = true
  },
  closeDialog: () => update.dialogOpened.value = false,
}

const save = {
  dto: reactive({
    title: '',
    description: '',
    type: selectedType,
    targetValue: '',
  }),
  clearDto: () => {
    save.dto.title = ''
    save.dto.description = ''
    save.dto.targetValue = ''
  },
  form: ref(null),
  submit: async () => {
    const { valid } = await save.form.value.validate()
    if (valid) {
      axios.post(API_URL.ADMIN_ACHIEVEMENT_SAVE, save.dto, {
        baseURL: admin.baseURL
      })
          .then(() => {
            getAllAchievements()
            save.closeDialog()
            save.clearDto()
            alert('등록이 완료되었습니다.')
          })
    }
  },
  dialogOpened: ref(false),
  openDialog: () => {
    save.dialogOpened.value = true
  },
  closeDialog: () => {
    save.dialogOpened.value = false
    save.clearDto()
  }
}

const state = {
  activate: (targetIndex) => {
    const id = content.pagedList[targetIndex].id
    axios.patch(API_URL.ADMIN_ACHIEVEMENT_ACTIVATE(id), null, {
      baseURL: admin.baseURL
    }).then(() => {
      alert("활성화 되었습니다.")
        content.pagedList[targetIndex].inactivated = false
    })
  },
  inactivate: (targetIndex) => {
    const id = content.pagedList[targetIndex].id
    axios.patch(API_URL.ADMIN_ACHIEVEMENT_INACTIVATE(id), null, {
      baseURL: admin.baseURL
    }).then(() => {
      alert("비활성화 되었습니다.")
      content.pagedList[targetIndex].inactivated = true
    })
  }
}

</script>

<template>
  <div class="block pb-15">
    <div class="d-flex justify-center">
      <VTabs bg-color="white" color="black" v-model="selectedType" hide-slider show-arrows align-tabs="center"
             selected-class="selected-tab" class="ma-2 w-fit rounded-lg border">
        <template v-for="(type, index) in content.types" :key="index">
          <VTab :value="type.key" rounded>{{ type.displayName }}</VTab>
        </template>
      </VTabs>
    </div>
    <VList class="mb-3 pb-0">
      <LoadingLayer v-if="content.isLoading"></LoadingLayer>
      <VListItem>
        <VRow align="center">
          <VCol cols="5">업적</VCol>
          <VCol>달성 조건</VCol>
          <VCol cols="2" class="text-center">상태</VCol>
          <VCol cols="2" class="text-center">관리</VCol>
        </VRow>
      </VListItem>
      <VDivider/>
      <template v-for="(achievement, index) in content.pagedList" :key="index">
        <VListItem :class="achievement.inactivated ? 'bg-grey-lighten-1' : ''">
          <VRow align="center">
            <VCol cols="5" style="word-break: keep-all;">
              <div>{{ achievement.title }}</div>
              <div class="text-grey-darken-1">{{ achievement.description }}</div>
            </VCol>
            <VCol style="word-break: keep-all;">
              <div>
                {{ achievement.targetMessage }}
              </div>
            </VCol>
            <VCol cols="2" class="text-center">
              <div>
                {{ achievement.inactivated ? "비활성" : "활성"}}
              </div>
            </VCol>
            <VCol cols="2" class="text-center">
              <div class="w-100">
                <VBtn class="ma-1" variant="text" rounded="lg" size="small" elevation="5" @click="update.openDialog(index)">수정</VBtn>
              </div>
              <div class="w-100">
                <VBtn v-if="achievement.inactivated" class="ma-1" variant="text" rounded="lg" size="small" elevation="5" @click="state.activate(index)">활성화</VBtn>
                <VBtn v-else class="ma-1" variant="text" rounded="lg" size="small" elevation="5" @click="state.inactivate(index)">비활성화</VBtn>
              </div>
            </VCol>
          </VRow>
        </VListItem>
        <VDivider/>
      </template>
    </VList>
    <VPagination v-if="totalPages > 0" v-model="page" :length="totalPages" :total-visible="8" :show-first-last-page=true></VPagination>
  </div>
  <VDialog max-width="500" v-model="update.dialogOpened.value" persistent id="updateDialog">
    <VCard>
      <VCardTitle>업적 수정</VCardTitle>
      <VDivider/>
      <VForm fast-fail @submit.prevent :ref="update.form">
        <VCardText>
          <VTextField clearable
                      counter="50"
                      persistent-counter
                      class="mb-1"
                      v-model="update.dto.title"
                      label="업적 제목 *"
                      :rules="[
                          () => !!update.dto.title || '업적 제목은 반드시 입력해야 합니다.',
                          () => update.dto.title.length <= 50 || '업적 제목은 50자를 넘을 수 없습니다.'
                      ]"
          >
          </VTextField>
          <VTextField clearable
                     counter="150"
                     persistent-counter
                     class="mb-1"
                     v-model="update.dto.description"
                     label="업적 설명 *"
                     :rules="[
                          () => !!update.dto.description || '업적 설명은 반드시 입력해야 합니다.',
                          () => update.dto.description.length <= 150 || '업적 설명은 150자를 넘을 수 없습니다.'
                      ]"
          >
          </VTextField>
          <small class="text-grey-darken-1">* 업적 타입과 목표 횟수는 수정이 불가능합니다.</small>
        </VCardText>
        <VDivider/>
        <VCardActions class="justify-center">
          <VBtn class="ma-1 align-content-center" variant="text" rounded="lg" size="small" elevation="5" @click="update.submit()">저장</VBtn>
          <VBtn class="ma-1 align-content-center" variant="text" rounded="lg" size="small" elevation="5" @click="update.closeDialog">취소</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <VDialog max-width="500" v-model="save.dialogOpened.value" persistent id="saveDialog">
    <VCard>
      <VCardTitle>업적 등록</VCardTitle>
      <VDivider/>
      <VForm fast-fail @submit.prevent :ref="save.form">
        <VCardText>
          <VTextField clearable
                      counter="50"
                      persistent-counter
                      class="mb-1"
                      v-model="save.dto.title"
                      label="업적 제목"
                      :rules="[
                          value => !!value || '업적 제목은 반드시 입력해야 합니다.',
                          () => save.dto.title.length <= 50 || '업적 제목은 50자를 넘을 수 없습니다.'
                      ]"
          >
          </VTextField>
          <VTextField clearable
                      counter="150"
                      persistent-counter
                      class="mb-1"
                      v-model="save.dto.description"
                      label="업적 설명"
                      :rules="[
                          () => !!save.dto.description || '업적 설명은 반드시 입력해야 합니다.',
                          () => save.dto.description.length <= 150 || '업적 설명은 150자를 넘을 수 없습니다.'
                      ]"
          >
          </VTextField>
          <VSelect
              readonly
              menu-icon=""
              label="업적 타입"
              class="mb-1"
              v-model="save.dto.type"
              :items="content.types"
              :item-title="item => item.displayName"
              :item-value="item => item.key">
          </VSelect>
          <VTextField
              label="목표 횟수"
              class="mb-1"
              v-model="save.dto.targetValue"
              type="number" min="1"
              :rules="[
                  () => !!save.dto.targetValue || '목표값은 반드시 입력해야 합니다.',
                  () => save.dto.targetValue > 0 || '목표값은 1보다 커야 합니다.',
                  () => !content.achievementsMap[selectedType].find((value) => value.targetValue.toString() === save.dto.targetValue.toString()) || '타입과 목표값이 중복된 업적입니다.',
              ]"
          ></VTextField>
          <small class="text-grey-darken-1">* 현재 선택된 타입 중 목표값이 중복되지 않는 경우만 등록할 수 있습니다.</small>
        </VCardText>
        <VDivider/>
        <VCardActions class="justify-center">
          <VBtn class="ma-1 align-content-center" variant="text" rounded="lg" size="small" elevation="5" @click="save.submit()">저장</VBtn>
          <VBtn class="ma-1 align-content-center" variant="text" rounded="lg" size="small" elevation="5" @click="save.closeDialog">취소</VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <div class="position-fixed ma-10" style="bottom:0; right:0;">
    <VBtn icon="mdi-plus" size="small" @click="save.openDialog()" />
  </div>
</template>