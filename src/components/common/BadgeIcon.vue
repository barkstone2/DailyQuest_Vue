<script setup>
defineProps({
  needBadge: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <div>
    <slot></slot>
    <div v-if="needBadge" class="icon-badge"></div>
  </div>
</template>

<style scoped>
.icon-badge {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  background-color: #f62f2f;
  font-size: 5px;
  padding: 5px 5px;
}
</style>