<template>
  <div class="app">
    <TreePanel v-if="$route.path !== '/'" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  data() {
    return {

    }
  },
  methods: {
    ...mapActions({
      checkDataWeb: 'checkDataWeb'
    }),

    async getDataAdmin() {
      await this.checkDataWeb();
      if (this.$route.path === '/' && this.getAuthInfo === true) {
        await this.$router.push('publishing-panel')
      } else if(this.$route.path !== '/' && this.getAuthInfo === false) {
        await this.$router.push('/')
      }
    }
  },
  mounted() {
    this.getDataAdmin()
  },
  computed: {
    ...mapGetters({
      getAuthInfo: 'getAuthInfo'
    })
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  min-width: 1000px;
}

:root {
  --primary-color: #3498db;
  /* Основной цвет */
  --secondary-color: #2ecc71;
  /* Вторичный цвет */
  --accent-color: #f39c12;
  /* Акцентный цвет */
  --background-color: #f5f5f5;
  /* Цвет фона */
  --text-color: #333;
  /* Цвет текста */
  --border-color: #ddd;
  /* Цвет границ */
  --button-color: #007bff;
  /* Цвет кнопок */
  --button-hover-color: #0056b3;
  /* Цвет кнопок при наведении */
  --button-text-color: #fff;
  /* Цвет текста на кнопках */
}

.app {
  display: flex;
}
</style>
