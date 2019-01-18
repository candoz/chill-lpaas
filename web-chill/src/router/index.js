import Vue from 'vue'
import Router from 'vue-router'
import Chessboard from '@/components/Chessboard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Chessboard',
      component: Chessboard
    }
  ]
})
