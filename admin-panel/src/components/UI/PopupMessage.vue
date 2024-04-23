<template>
  <transition name="popup-slide">
    <div v-if="isVisible" class="popup">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'popup-message',
  data() {
    return {
      isVisible: false,
      message: '',
      duration: 3000
    };
  },
  methods: {
    showMessage(message, duration = 3000) {
      this.isVisible = true;
      this.message = message;
      this.duration = duration;
      setTimeout(() => {
        this.hideMessage();
      }, this.duration);
    },
    hideMessage() {
      this.isVisible = false;
      this.message = '';
    }
  }
};
</script>

<style>
.popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 9999;
}
</style>
