<template>
  <div class="publishing-panel">
    <Publish />
    <PublishPosts @post-panel="openPostPanel" />

    <PostPanel v-if="state.postPanel" :images="state.images" @close="closePostPanel" />
    <div class="publishing-panel__overplay" v-if="state.overlay" @click="closePostPanel" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import Publish from '@/views/publichingPanel/Publish.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'
import PostPanel from '@/components/form/postPanel/PostPanel.vue'
import { receivingPost } from '@/http/postsAPI';

const state = reactive({
  postPanel: false as boolean,
  images: [] as string[],
  overlay: false as boolean,
})

const openPostPanel = async (value: number) => {
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