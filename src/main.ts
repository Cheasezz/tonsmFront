import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { TonConnectUIPlugin } from './tonconnect'
import { publicUrl } from './helperts/publicUrl'
import { init } from './init'
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'

import './mockEnv'
import { errorHandler } from './errorHandler'

const app = createApp(App)
app.config.errorHandler = errorHandler
// Configure all application dependencies.
init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

app.use(createPinia())
app.use(router)
app.use(TonConnectUIPlugin, {
  manifestUrl: publicUrl('https://cheasezz.github.io/tonsmFront/tonconnect-manifest.json'),
})
app.mount('#app')
