<script setup>
import { RouterView } from 'vue-router';
import { PRINCIPAL } from './stores/principal'
import { MENU } from './stores/menu';
import BadgeIcon from "@/components/common/BadgeIcon.vue";
import {provide, ref} from "vue";
import NotificationListView from "@/views/notification/NotificationListView.vue";
import LoadingLayer from "@/components/common/LoadingLayer.vue";
import {LAYOUT} from "@/stores/layout";

const notificationOpened = ref(false)
provide('notificationOpened', notificationOpened)

const openNotification = () => {
  notificationOpened.value = true
}

const test = ref(true)

</script>
<template>
    <VLayout class="h-100" style="place-items: center;">
        <VBtn v-if="PRINCIPAL.id" rounded="lg" height="auto" class="position-fixed text-left pa-2 ma-5"
            style="top:0; right:0;" @click.stop="MENU.toggleSideMenu()">
            <div>
                <div class="d-flex pb-2 align-center">
                    <div class="pe-3 font-weight-bold" style="font-size:medium">{{ PRINCIPAL.nickname }}</div>
                    <div>Level {{ PRINCIPAL.level }}</div>
                </div>
                <div>Exp {{ PRINCIPAL.getExpText() }}</div>
                <div>Gold {{ PRINCIPAL.gold }}</div>
            </div>
          <div v-if="PRINCIPAL.notificationCount > 0" class="badge"></div>
        </VBtn>
        <VNavigationDrawer v-model="MENU.sideMenuOpened" temporary location="right">
            <VListItem>
                <VListItemTitle class="pa-1">
                    <div class="d-flex pb-2 align-center">
                        <div class="pe-3 font-weight-bold" style="font-size:medium">{{ PRINCIPAL.nickname }}</div>
                        <div>Level {{ PRINCIPAL.level }}</div>
                    </div>
                    <div>Exp {{ PRINCIPAL.getExpText() }}</div>
                    <div>Gold {{ PRINCIPAL.gold }}</div>
                </VListItemTitle>
            </VListItem>
          <VDivider></VDivider>
            <div class="d-flex justify-space-around pa-2">
              <BadgeIcon :need-badge="PRINCIPAL.notificationCount > 0" :count="PRINCIPAL.notificationCount" class="pa-1 cursor-pointer" @click="openNotification">
                <VIcon icon="mdi-bell-outline"/>
              </BadgeIcon>
              <BadgeIcon class="d-none pa-1">
                <VIcon icon="mdi-email-outline"></VIcon>
              </BadgeIcon>
              <BadgeIcon class="d-none pa-1">
                <VIcon icon="mdi-chat-outline"></VIcon>
              </BadgeIcon>
            </div>

            <VDivider></VDivider>

            <VList density="compact" nav>
            <template v-for="(menu, index) in MENU.sideMenus" :key="index">
                <VListItem v-if="menu.needAdmin ? PRINCIPAL.isAdmin : true" :prepend-icon="menu.icon" :title="menu.title"
                           :active="MENU.selectedMenuOnSide === menu.value" :value="menu.value" @click="MENU.navOnSideMenu(menu.value)">
                </VListItem>
            </template>
            </VList>
            <template #append>
                <div class="pa-2">
                    <VBtn block rounded="lg" @click="MENU.sideMenuOpened = false; PRINCIPAL.logout()">logout</VBtn>
                </div>
            </template>
        </VNavigationDrawer>
        <RouterView></RouterView>
      <VDialog max-width="500" v-model="notificationOpened" :scrim=false>
        <NotificationListView v-if="notificationOpened"/>
      </VDialog>
      <VOverlay v-model="LAYOUT.showRequestProcessLayout" persistent no-click-animation
                class="justify-center align-center no-drag" content-class="text-center">
        <VProgressCircular indeterminate/>
        <div class="pa-3">처리 중입니다.</div>
      </VOverlay>
    </VLayout>
</template>
<style>
.w-fit {
  width: fit-content;
}
.badge {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  background-color: #f62f2f;
  font-size: 5px;
  padding: 5px 5px;
}
.selected-tab {
  background-color: lightgray;
  border-radius: 0 !important;
}
</style>