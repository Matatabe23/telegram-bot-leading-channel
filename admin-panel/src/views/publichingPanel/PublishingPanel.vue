<template>
  <div class="publishing-panel">
    <publish @get-posts="getPosts"/>
    <PublishPosts :posts="posts" :totalCount="totalCount" @get-posts="getPosts" @post-panel="getPostPanel"/>

    <postPanel v-if="postPanel" :images="images" @close="closePostPanel"/>
    <popup-message ref="popup"/>
    <div class="publishing-panel__overplay" v-if="overlay" @click="closePostPanel"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import publish from '@/views/publichingPanel/Publish.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'
import { receiving } from '@/http/postsAPI';
import { post } from '@/types';
import postPanel from '@/components/form/postPanel/postPanel.vue'
import { receivingPost } from '@/http/postsAPI';

export default defineComponent({
  data() {
    return {
      posts: [] as post[],
      totalCount: 0 as number,
      postPanel: false as boolean,
      images: [] as string[],
      overlay: false as boolean
    };
  },
  components: {
    publish,
    PublishPosts,
    postPanel
  },
  methods: {
    async getPosts(currentPage: number, postsPerPage: number) {
      try {
        const posts = await receiving(currentPage, postsPerPage);
        this.posts = posts.posts;
        this.totalCount = posts.totalCount;
      } catch (e: any) {
        console.error(e);
      }
    },
    async getPostPanel(value: number){
      this.postPanel = !this.postPanel;
      this.overlay = !this.overlay;
      this.images = await receivingPost(value);
    },
    closePostPanel(){
      this.postPanel = !this.postPanel;
      this.overlay = !this.overlay;
    }
  }
})
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 30px 0 ;

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