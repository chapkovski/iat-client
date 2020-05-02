import Vue from 'vue'
import App from './App.vue'
import '../sass/app.scss'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vue2TouchEvents from 'vue2-touch-events'
 
Vue.use(Vue2TouchEvents)
// Install BootstrapVue 
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
