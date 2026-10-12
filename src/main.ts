import { createApp } from 'vue';

import App from './App.vue';
import { registerDirectives } from './directives';
import { i18n } from './locales';
import { router } from './router';
import { pinia } from './stores';
import './styles/index.css';

const app = createApp(App);

app.use(pinia).use(i18n).use(router);
registerDirectives(app);
app.mount('#app');
