import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Theme variables */
import './theme/variables.css';

/* Ionic CSS, Tailwind CSS and Shipzy design tokens (see file for layer order) */
import './theme/tailwind.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
