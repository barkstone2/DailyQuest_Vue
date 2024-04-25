<script setup>
defineProps({
  questType: {
    type: String,
    default: 'SUB'
  }
})
</script>
<template>
  <VChip class="ma-1 font-weight-bold" label size="small" color="primary" v-if="questType === 'MAIN'" text="메인"/>
  <VChip class="ma-1 font-weight-bold" label size="small" color="secondary" v-else text="서브"/>
</template>

<style scoped>
</style>