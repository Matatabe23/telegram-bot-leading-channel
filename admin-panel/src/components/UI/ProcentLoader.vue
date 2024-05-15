<template>
  <div class="loading-overlay" v-if="overlay">
    <div class="loading-spinner" :class="{'loading-spinner--loading': !overlay}">
      <div class="loading-spinner__progress">{{ progressPercent }}%</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProcentLoader',
  props: {
    overlay: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 1
    },
    loaded: {
      type: Number,
      default: 0
    }
  },
  computed: {
    progressPercent() {
      const progress = Math.ceil((this.loaded / this.total) * 100);
      return progress;
    }
  }
});
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  &--none {
    background-color: rgba(0, 0, 0, 0);
  }

  .loading-spinner {
    position: relative;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 80px;
    height: 80px;

    .loading-spinner__progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 16px;
      transition: all 0.5s ease;
    }
  }
}
</style>
