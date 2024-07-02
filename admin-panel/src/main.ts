import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { createPinia } from 'pinia';

import componentUI from '@/components/UI'
import componentPanels from '@/components/Panel'

import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const pinia = createPinia();
const app = createApp(App)

const components = [...componentUI, ...componentPanels];
components.forEach((component: any) => {
  app.component(component.name, component);
});

app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
});

app
  .use(router)
  .use(pinia)
  .use(store)
  .mount('#app')
