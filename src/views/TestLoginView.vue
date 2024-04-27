<script setup>
const ENV = import.meta.env

import router from "@/router";
import {PRINCIPAL} from "@/stores/principal";

function loginTestAdmin() {
  document.cookie = `X-ACCESS-TOKEN=${ENV.VITE_TEST_ADMIN_TOKEN}; path=/; domain=${ENV.VITE_TEST_TOKEN_DOMAIN};`
  PRINCIPAL.synchronize()
      .then(() => {
        router.push("/")
      })
}

function loginTestUser() {
  document.cookie = `X-ACCESS-TOKEN=${ENV.VITE_TEST_USER_TOKEN}; path=/; domain=${ENV.VITE_TEST_TOKEN_DOMAIN};`
  PRINCIPAL.synchronize()
      .then(() => {
        router.push("/")
      })
}

</script>
<template>
  <VContainer class="h-50 w-50 align-content-center">
    <VContainer class="h-fit w-fit bg-white rounded">
      <VRow class="align-self-center justify-center">
        <VCol class="v-col-12 text-center d-flex justify-center">
          <h3>테스트 계정 로그인</h3>
        </VCol>
      </VRow>
      <VRow>
        <VCol class="text-center d-flex justify-center">
          <VBtn @click="loginTestUser">유저 로그인</VBtn>
        </VCol>
        <VCol class="text-center d-flex justify-center">
          <VBtn @click="loginTestAdmin">관리자 로그인</VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VContainer>
</template>