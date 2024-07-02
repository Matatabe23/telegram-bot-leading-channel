<template>
  <div class="publishing-panel">
    <publish @get-posts="getPosts" />
    <PublishPosts :posts="state.posts" :totalCount="state.totalCount" :publishTime="state.publishTime"
      @get-posts="getPosts" @post-panel="getPostPanel" />

    <postPanel v-if="state.postPanel" :images="state.images" @close="closePostPanel" />
    <div class="publishing-panel__overplay" v-if="state.overlay" @click="closePostPanel" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive } from 'vue';
import publish from '@/views/publichingPanel/Publish.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'
import { receiving } from '@/http/postsAPI';
import { IPostsList } from '@/types';
import postPanel from '@/components/form/postPanel/postPanel.vue'
import { receivingPost } from '@/http/postsAPI';

const state = reactive({
  posts: [] as IPostsList[],
  totalCount: 0 as number,
  postPanel: false as boolean,
  images: [] as string[],
  overlay: false as boolean,
  publishTime: [] as { hour: string, minute: string }[]
})

const getPosts = async (currentPage: number, postsPerPage: number) => {
  try {
    const posts = await receiving(currentPage, postsPerPage);
    state.posts = posts.posts;
    state.totalCount = posts.totalCount;
    state.publishTime = posts.publishTime;
  } catch (e: any) {
    console.error(e);
  }
}

const getPostPanel = async (value: number) => {
  state.postPanel = !state.postPanel;
  state.overlay = !state.overlay;
  state.images = await receivingPost(value);
}

const closePostPanel = () => {
  state.postPanel = !state.postPanel;
  state.overlay = !state.overlay;
  state.images = []
}
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 30px 0;

  &__overplay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 500;
  }
}
</style>