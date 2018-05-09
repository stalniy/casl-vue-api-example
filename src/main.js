import Vue from 'vue'
import Vuetify from 'vuetify'
import { abilitiesPlugin } from '@casl/vue'
import App from './App'
import Confirm from './components/Confirm'
import router from './router'
import store from './store'
import { ability } from './store/ability'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(abilitiesPlugin, ability)
Vue.prototype.$confirm = function(...args) {
  return this.$root.confirm(...args)
}

const ConfirmComponent = Vue.extend(Confirm)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  methods: {
    confirm(message, title, params = {}) {
      const dialog = new ConfirmComponent({
        parent: this,
        propsData: {
          message,
          title,
          params
        }
      })
      dialog.$mount()
      document.body.appendChild(dialog.$el)
      dialog.open()

      return new Promise((resolve) => {
        dialog.$once('close', (isAccepted) => {
          document.body.removeChild(dialog.$el)
          resolve(isAccepted)
        })
      })
    }
  }
})
