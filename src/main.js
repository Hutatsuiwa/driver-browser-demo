import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'

createApp(App).use(router,axios,VueAxios).mount('#app')
