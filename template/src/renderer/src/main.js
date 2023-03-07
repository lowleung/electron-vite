import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import DataV from '@dataview/datav-vue3';
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueViewer)
  .use(VueVideoPlayer)
  .use(Vue3Lottie)
  .use(DataV,{classNamePrefix:'dv-'})
  .mount('#app')
