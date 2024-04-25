<script setup>
defineProps({
  questState: {
    type: String,
    default: 'PROCEED'
  }
})
</script>

<template>
  <VChip class="ma-1 font-weight-bold" label size="small" color="indigo" v-if="questState === 'PROCEED'" text="진행중"/>
  <VChip class="ma-1 font-weight-bold" label size="small" color="green" v-else-if="questState === 'COMPLETE'" text="완료"/>
  <VChip class="ma-1 font-weight-bold" label size="small" v-else-if="questState === 'DISCARD'" text="포기"/>
  <VChip class="ma-1 font-weight-bold" label size="small" color="red" v-else-if="questState === 'FAIL'" text="실패"/>
</template>

<style scoped>
</style>