import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { TonConnectUIPlugin } from './tonconnect'
import { publicUrl } from './helperts/publicUrl'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TonConnectUIPlugin, {
  manifestUrl: publicUrl(
    'https://cheasezz.github.io/tonsmFront/tonconnect-manifest.json',
  ),
})
app.mount('#app')
