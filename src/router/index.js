import Vue from 'vue'
import Router from 'vue-router'
import Breakdown from '@/components/Breakdown'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Breakdown',
      component: Breakdown
    }
  ]
})
