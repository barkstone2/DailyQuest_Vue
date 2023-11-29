<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

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