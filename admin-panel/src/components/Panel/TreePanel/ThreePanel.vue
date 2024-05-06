<template>
  <div class="tree-panel" :class="{ 'open-panel': isOpen }">
    <div class="tree-panel__menu-icon" @click="isOpen = !isOpen" :class="{ 'opem-menu-icon': isOpen }">
      <img src="@/assets/image/menu.png" alt="">
    </div>
    <div class="tree-panel__panel">
      <h1>Tg-bot</h1>
      <h3 @click="$router.push('/publishing-panel')">Публикация</h3>
      <h3 @click="$router.push('/publishing-panel')">Участники</h3>
      <h3 @click="$router.push('/settings')">Настройки</h3>
      <h3 @click="exit()">Выйти</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'TreePanel',
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    ...mapActions({
      setExitAuth: 'setExitAuth'
    }),

    async exit() {
      await localStorage.removeItem('admin');
      await localStorage.removeItem('token');
      await this.setExitAuth()
      await this.$router.push('/')
    }
  }
});
</script>

<style lang="scss">
.tree-panel {
  background-color: rgba(20, 20, 20, 0.5);
  backdrop-filter: blur(16px);
  height: 100vh;
  width: 350px;
  position: fixed;
  left: -350px;
  transition: all 0.2s ease;
  z-index: 999;

  &__panel {
    padding: 0 5vh;

    h1 {
      color: gold;
      font-size: 50px;
    }

    h3 {
      color: aquamarine;
      border-left: 3px solid gold;
      padding-left: 10px;
      margin-top: 50px;
      font-size: 25px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    h3:hover {
      padding-left: 15px;
      border-left: 5px solid gold;
    }
  }

  &__menu-icon {
    position: absolute;
    right: 0;
    transform: translate(100%, -5%);
    color: #333;
    cursor: pointer;
    transition: all 0.2 ease;
  }
}

.open-panel {
  left: 0;
}
</style>
