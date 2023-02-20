import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MonacoEditorView from '../views/MonacoEditorView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'editor',
    component: resolve => require(['../views/MonacoEditorView.vue'], resolve)
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
