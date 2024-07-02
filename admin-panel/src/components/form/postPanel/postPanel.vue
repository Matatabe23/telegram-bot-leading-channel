<template>
  <div class="post-panel">
    <div class="post-panel__img-list">
      <div v-for="(photo, index) in props.images" :key="index">
        <div class="post-panel__close" @click="$emit('close')">✖</div>
        <img :src="photo" alt="Photo" class="post-panel__image">
      </div>
    </div>

    <div class="post-panel__buttons">
      <MainButton class="posts__deleteButton">Предыдущий пост</MainButton>
      <MainButton class="posts__deleteButton">Закрыть</MainButton>
      <MainButton class="posts__deleteButton">Сохранить изменения</MainButton>
      <MainButton class="posts__deleteButton">Следующий пост</MainButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  images: string[]
}>();
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
  overflow-y: auto;


  &__img-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

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

  &__buttons {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background-color: gray;
    position: sticky;
    bottom: 0;
  }
}
</style>