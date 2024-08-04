import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia';
import vuetify from "@/plugins/vuetify";

import componentUI from '@/components/UI'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { toastOptions } from '@/useApp/toast'

const pinia = createPinia();
const app = createApp(App)

const components = [...componentUI];
components.forEach((component: any) => {
  app.component(component.name, component);
});

app
  .use(Toast, toastOptions)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
