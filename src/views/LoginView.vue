<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import router from '@/router';
import { PRINCIPAL } from '@/stores/principal';
import { MENU } from '@/stores/menu';
import { API_URL, API_CONFIG } from '@/stores/api';

function onLoginSuccess(response) {
    const googleIdToken = response.credential

    axios.post(API_URL.TOKEN_ISSUE,
        {
            "idToken": googleIdToken,
            "providerType": "GOOGLE"
        }
    ).then((tokenResponse) => {
      if(tokenResponse) {
        PRINCIPAL.synchronize().then(() => {
          router.push(MENU.redirectRoute)
        })
      }
    })
}

onMounted(() => {
    google.accounts.id.initialize({
        client_id: API_CONFIG.GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: true,
        callback: onLoginSuccess
    });
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "filled_black", size: "large" }  // customization attributes
    );
})

</script>

<template>
    <VContainer class="h-50 w-50">
        <VContainer class="h-50 d-flex">
            <VRow class="align-self-center justify-center">
                <VCol class="v-col-12 text-center">
                    <img alt="Vue logo" src="@/assets/logo.png" width="125" height="125" />
                </VCol>
                <VCol class="v-col-12 text-center d-flex justify-center">
                    <div id="buttonDiv" class="w-fit"></div>
                </VCol>
            </VRow>
        </VContainer>
    </VContainer>
</template>