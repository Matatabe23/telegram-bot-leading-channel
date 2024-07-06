<template>
  <div class="publishing-panel">
    <PublishPanel />
    <PublishPosts />
  </div>
</template>

<script lang="ts" setup>
import PublishPanel from '@/views/publichingPanel/PublishPanel.vue'
import PublishPosts from '@/views/publichingPanel/PublishPosts.vue'
</script>

<style lang="scss">
.publishing-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 30px 0;
}
</style>