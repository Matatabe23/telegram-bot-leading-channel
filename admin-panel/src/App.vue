<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  data() {
    return {
      
    }
  },
  methods:{
    ...mapActions({
      checkDataWeb: 'checkDataWeb'
    })
  },
  mounted(){
    this.checkDataWeb()
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color)
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
  --button-color: #3498db;
  /* Цвет кнопок */
  --button-hover-color: #2980b9;
  /* Цвет кнопок при наведении */
  --button-text-color: #fff;
  /* Цвет текста на кнопках */
}
</style>
