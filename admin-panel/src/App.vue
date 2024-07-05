<template>
  <div class="app">
    <TreePanel v-if="route.path !== '/'" />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/store/useAuth';
import { storeToRefs } from 'pinia';
import TreePanel from '@/components/Panel/TreePanel/ThreePanel.vue'

const router = useRouter()
const route = useRoute()
const editorStore = useAuth();
const { auth } = storeToRefs(editorStore);

const getDataAdmin = async () => {
  await editorStore.checkDataWeb();
  if (route.path === '/' && auth.value === true) {
    await router.push('publishing-panel')
  } else if (route.path !== '/' && auth.value === false) {
    await router.push('/')
  }
}

onMounted(() => {
  getDataAdmin()
})

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
