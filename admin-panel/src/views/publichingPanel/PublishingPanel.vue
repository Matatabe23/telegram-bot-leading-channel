<template>
  <div class="publishing-panel">
    <publish/>
    <PublishPosts/>

    <popup-message ref="popup"></popup-message>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import publish from '@/views/publichingPanel/Publish.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'

export default defineComponent({
  data() {
    return {

    };
  },
  components: {
    publish,
    PublishPosts
  },
})
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin: 30px 0 ;
}
</style>