<template>
  <div class="publishing-panel">
    <publish @get-posts="getPosts"/>
    <PublishPosts :posts="posts" :totalCount="totalCount" @get-posts="getPosts"/>

    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import publish from '@/views/publichingPanel/Publish.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'
import { receiving } from '@/http/postsAPI';
import { post } from '@/types';

export default defineComponent({
  data() {
    return {
      posts: [] as post[],
      totalCount: 0 as number
    };
  },
  components: {
    publish,
    PublishPosts
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
}
</style>