import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import { abilitiesPlugin } from '@casl/vue'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(abilitiesPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
