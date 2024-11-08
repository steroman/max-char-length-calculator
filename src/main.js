import '/style.css';
import emailjs from '@emailjs/browser';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import router from './router'

emailjs.init('wDRAXj5G6LhnaXLr3');

const app = createApp(App)

app.use(createPinia())
// app.use(router)

app.mount('#app')
