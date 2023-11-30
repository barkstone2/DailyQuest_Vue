<script setup>
import router from '@/router';
import axios from 'axios'
import {PRINCIPAL} from "@/stores/principal";
import {API_CONFIG} from "@/stores/api";
function healthCheck() {
  axios.get('')
      .catch((error) => {
        if(error.code === 'ERR_NETWORK') setTimeout(healthCheck, 10000);
        else {
          API_CONFIG.SERVER_ERROR = false
          PRINCIPAL.synchronize().then(() => {
            router.push('/')
          })
        }
      })
}

healthCheck()

</script>
<template>
    <VContainer class="h-50 w-50">
        <VContainer class="h-50 d-flex">
            <VRow class="align-self-center justify-center">
                <VCol class="v-col-12 text-center">
                    <h1>서버가 아파요 ㅠㅠ</h1>
                </VCol>
            </VRow>
        </VContainer>
    </VContainer>
</template>