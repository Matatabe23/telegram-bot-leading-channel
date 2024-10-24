import './app/styles/index.scss';

import App from './App.vue';
import FloatingVue from 'floating-vue';
import VueLazyload from 'vue-lazyload';
import VueTheMask from 'vue-the-mask';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './app/router';

import vuetify from '@/shared/plugins/vuetify';
import Toast, { toastOptions } from '@/shared/plugins/toast';

const app = createApp(App);
const pinia = createPinia();

// app.config.errorHandler = () => router.push('/not-found');

app.use(FloatingVue)
    .use(pinia)
    .use(router)
    .use(VueLazyload, {
        preLoad: 2
    })
    .use(Toast, toastOptions)
    .use(vuetify)
    .use(VueTheMask)
    .mount('#app');
