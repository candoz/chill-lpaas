// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import { MdButton } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.css'
import VModal from 'vue-js-modal'

Vue.use(VModal)
Vue.use(MdButton)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: { App },
  template: '<App/>'
})
