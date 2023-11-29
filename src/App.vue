<script setup>
import { RouterView } from 'vue-router';
import { principal } from './stores/principal'
import { menu } from './stores/menu';

</script>
<template>
    <VLayout class="h-100" style="place-items: center;">
        <VBtn v-if="principal.id" rounded="lg" height="auto" class="position-fixed text-left pa-2 ma-5"
            style="top:0; right:0;" @click.stop="menu.toggleSideMenu()">
            <div>
                <div class="d-flex pb-2 align-center">
                    <div class="pe-3 font-weight-bold" style="font-size:medium">{{ principal.nickname }}</div>
                    <div>Level {{ principal.level }}</div>
                </div>
                <div>Exp {{ principal.getExpText() }}</div>
                <div>Gold {{ principal.gold }}</div>
            </div>
        </VBtn>
        <VNavigationDrawer v-model="menu.sideMenuOpened" temporary location="right">
            <VListItem>
                <VListItemTitle class="pa-1">
                    <div class="d-flex pb-2 align-center">
                        <div class="pe-3 font-weight-bold" style="font-size:medium">{{ principal.nickname }}</div>
                        <div>Level {{ principal.level }}</div>
                    </div>
                    <div>Exp {{ principal.getExpText() }}</div>
                    <div>Gold {{ principal.gold }}</div>
                </VListItemTitle>
            </VListItem>

            <VDivider></VDivider>

            <VList density="compact" nav>
            <template v-for="(menu, index) in menu.sideMenus" :key="index">
                <VListItem v-if="menu.needAdmin ? principal.isAdmin : true" :prepend-icon="menu.icon" :title="menu.title"
                           :active="menu.selectedMenuOnSide === menu.value" :value="menu.value" @click="menu.navOnSideMenu(menu.value)">
                </VListItem>
            </template>
            </VList>
            <template #append>
                <div class="pa-2">
                    <VBtn block rounded="lg" @click="menu.sideMenuOpened = false; principal.logout()">logout</VBtn>
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