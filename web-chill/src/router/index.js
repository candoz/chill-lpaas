import Vue from 'vue'
import Router from 'vue-router'
import MainView from '@/components/MainView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainView',
      component: MainView
    }
  ]
})
