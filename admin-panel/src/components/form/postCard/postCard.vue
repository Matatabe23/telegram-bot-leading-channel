<template>
  <div class="post">
    <div class="post__post-content">
      <div class="post__post-images">
        <img class="post__post-image" v-for="img in props.post.imageData" :key="img.id" :src="img.image" alt="">
      </div>
      <div class="post__post-ietails">
        <h2 class="post__post-title">id: {{ props.post.id }}</h2>
        <div class="post__controle-buttons">
          <v-btn color="#5865f2" variant="flat" @click="emit('delete-post', props.post.id)">Удалить</v-btn>
          <v-btn color="#5865f2" variant="flat" @click="router.push(`post/${props.post.id}`)">Открыть</v-btn>
          <v-btn color="#5865f2" variant="flat" @click="emit('publish-instantly-post', props.post.id)">Опубликовать</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { IPosts } from '@/types'

const router = useRouter()

const props = defineProps<{
  post: IPosts
}>();

const emit = defineEmits<{
  'delete-post': [value: number],
  'publish-instantly-post': [value: number],
}>();

</script>

<style lang="scss">
.post {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &__post-content {
    display: flex;
    padding: 20px;
  }

  &__post-images {
    margin-right: 20px;
  }

  &__post-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  &__post-details {
    flex: 1;
  }

  &__post-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
  }

  &__post-description {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
  }

  &__controle-buttons {
    display: flex;
    gap: 10px;
  }
}
</style>