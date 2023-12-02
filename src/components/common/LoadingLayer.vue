<script setup>

</script>

<template>
  <div class="bg-grey-lighten-2 loading-layer">
    <VProgressCircular indeterminate></VProgressCircular>
  </div>

</template>

<style scoped>
.loading-layer {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  margin: inherit !important;
  padding: inherit !important;
  z-index:10000 !important;
  border-radius: inherit !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}
</style>