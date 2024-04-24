import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import componentUI from '@/components/UI'
import componentPanels from '@/components/Panel'

const app = createApp(App)

const components = [...componentUI, ...componentPanels];
components.forEach((component: any) => {
  app.component(component.name, component);
});

app
  .use(router)
  .use(store)
  .mount('#app')
