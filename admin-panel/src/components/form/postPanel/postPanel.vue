<template>
  <div class="postPanel">
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {

    }
  }
})
</script>

<style lang="scss">
.postPanel {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(100, 100, 100);
  width: 80%;
  min-height: 80vh;
  border-radius: 15px;
}
</style>