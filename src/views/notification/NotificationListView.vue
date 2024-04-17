<script setup>

import axios from "axios";
import {inject, reactive, ref, watch} from "vue";
import {API_URL} from "@/stores/api";
import router from "@/router";
import {MENU} from "@/stores/menu";

const notificationOpened = inject('notificationOpened', true);

const content = reactive({
  list: [],
  totalPages: 0,
  isLoading: true,
})

const retrieveCondition = reactive({
  type: '',
  page: 1,
})

const tab = ref("not-confirmed")
watch(tab, () => {
  content.page = 1
  getNotifications()
})

function getNotConfirmedNotifications() {
  const url = `${API_URL.NOTIFICATION.NOT_CONFIRMED_LIST}?page=${retrieveCondition.page-1}&type=${retrieveCondition.type}`;
  axios
      .get(url)
      .then((res) => {
        if (res) {
          const data = res.data.data;
          content.list = data.content
          content.totalPages = data.totalPages
          retrieveCondition.page = data.number+1
          content.isLoading = false
        }
      })
}

function getAllNotifications() {
  const url = `${API_URL.NOTIFICATION.ALL_LIST}?page=${retrieveCondition.page-1}&type=${retrieveCondition.type}`;
  axios
      .get(url)
      .then((res) => {
        if (res) {
          const data = res.data.data;
          content.list = data.content
          content.totalPages = data.totalPages
          retrieveCondition.page = data.number+1
          content.isLoading = false
        }
      })
}

function getNotifications() {
  content.isLoading = true
  if (tab.value === 'not-confirmed') {
    getNotConfirmedNotifications()
  } else {
    getAllNotifications()
  }
}

getNotifications()

function confirmAllNotification() {
  const url = `${API_URL.NOTIFICATION.CONFIRM_ALL}`;
  axios
      .patch(url)
      .then((res) => {
        if (res) {
          MENU.toggleSideMenu()
          notificationOpened.value = false
          alert('모든 알림을 확인했습니다.')
          if (tab.value === 'not-confirmed') {
            content.list = []
            content.totalPages = 0
          }
          retrieveCondition.page = 1
          content.isLoading = false
        }
      })
}

function deleteAllNotification() {
  if (confirm('삭제한 알림은 복구할 수 없습니다. 정말 모든 알림을 삭제하시겠습니까?')) {
    const url = `${API_URL.NOTIFICATION.DELETE_ALL}`;
    axios
        .patch(url)
        .then((res) => {
          if (res) {
            MENU.toggleSideMenu()
            notificationOpened.value = false
            alert('모든 알림을 삭제했습니다.')
            content.list = []
            content.totalPages = 0
            retrieveCondition.page = 1
            content.isLoading = false
          }
        })
  }
}

function confirmNotification(notificationId, notificationIndex) {
  const url = `${API_URL.NOTIFICATION.CONFIRM(notificationId)}`;
  axios
      .patch(url)
      .then((res) => {
        if (res) {
          content.list.splice(notificationIndex, 1)
          retrieveCondition.page = 1
          content.isLoading = false
        }
      })
}

function deleteNotification(notificationId, notificationIndex) {
  if (confirm("삭제한 알림은 복구할 수 없습니다. 정말 알림을 삭제하시겠습니까?")) {
    const url = `${API_URL.NOTIFICATION.DELETE(notificationId)}`;
    axios
        .patch(url)
        .then((res) => {
          if (res) {
            content.list.splice(notificationIndex, 1)
            alert('알림을 삭제했습니다.')
          }
        })
  }
}

function routingNotification(notificationId, index) {
  const notification = content.list[index];
  confirmNotification(notificationId, index)
  const notificationType = notification.type;
  switch (notificationType) {
    case 'ACHIEVEMENT_ACHIEVE': {
      router.push('/status/achievements')
      break
    }
    default: {
      console.log('not supported type')
      break
    }
  }

  MENU.toggleSideMenu()
  notificationOpened.value = false
}

</script>
<template>
  <VCard class="py-2">
    <div class="d-flex justify-center">
      <VTabs bg-color="white" color="black" v-model="tab" hide-slider align-tabs="center" selected-class="selected-tab" class="mt-2 w-fit rounded-lg text-center">
        <VTab color="black" value="not-confirmed">확인하지 않은 알림</VTab>
        <VTab color="black" value="confirmed">전체 알림</VTab>
      </VTabs>
    </div>
    <VDivider class="mt-3"/>
    <VCardText class="overflow-auto h-600-non-select">
        <VCard v-for="(notification, index) in content.list" :key="index" elevation="3" hover variant="outlined" class="mb-3"
               @click="routingNotification(notification.id, index)"
               :class="notification.confirmedDate != null ? 'text-grey-lighten-1' : ''">
          <VCardTitle class="text-wrap">{{ notification.title }}</VCardTitle>
          <VCardSubtitle class="text-wrap">{{ notification.content }}</VCardSubtitle>
          <VCardText class="text-right">{{ notification.createdDate }}</VCardText>
          <VBtn size="25" variant="text" rounded="false" class="position-absolute ma-2" @click.stop="deleteNotification(notification.id, index)" style="top:0; right:0;">X</VBtn>
        </VCard>
    </VCardText>
    <VPagination v-if="content.totalPages > 0" v-model="retrieveCondition.page" @click="getNotifications" :length="content.totalPages" :total-visible="6" :show-first-last-page=true></VPagination>
    <VCardActions class="d-flex justify-center">
      <VBtn rounded="lg" elevation="5" @click="confirmAllNotification">모든 알림 확인하기</VBtn>
      <VBtn rounded="lg" elevation="5" @click="deleteAllNotification">모든 알림 삭제하기</VBtn>
    </VCardActions>
  </VCard>
</template>
<style scoped>
.h-600-non-select {
  min-height: 600px;
  max-height: 600px;
  user-select: none;
}

</style>