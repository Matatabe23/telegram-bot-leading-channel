<template>
  <div class="post-panel">
    <div v-for="(photo, index) in images" :key="index">
      <div class="post-panel__close" @click="$emit('close')">✖</div>
      <img :src="photo" alt="Photo" class="post-panel__image">
    </div>


  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    images: {
      type: Array as () => Array<string>,
      required: true,
      default: () => []
    }
  },
})
</script>

<style lang="scss">
.post-panel {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(100, 100, 100);
  width: 80%;
  height: 80vh;
  border-radius: 15px;
  z-index: 999;
  

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;

  &__image {
    height: 70vh;
    width: 45vh;
    object-fit: contain;
    position: relative;
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px 20px 0 0;
    cursor: pointer;
    z-index: 300;
  }
}
</style>