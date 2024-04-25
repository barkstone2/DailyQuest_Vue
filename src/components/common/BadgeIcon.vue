<script setup>
defineProps({
  needBadge: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0
  }
})

</script>

<template>
  <div>
    <slot></slot>
    <div v-if="needBadge" class="icon-badge">
      <template v-if="count > 0">{{ count }}</template>
    </div>
  </div>
</template>

<style scoped>
.icon-badge {
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  border-radius: 50%;
  background-color: #f62f2f;
  font-size: 15px !important;
  color: white;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
}
</style>