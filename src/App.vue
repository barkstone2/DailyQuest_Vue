<script setup>
import { RouterView } from 'vue-router';
import { PRINCIPAL } from './stores/principal'
import { MENU } from './stores/menu';

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
    </VLayout>
</template>
<style>
.w-fit {
  width: fit-content;
}
</style>