import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    component: resolve => require(['../views/LayoutView.vue'], resolve),
    children: [
      {
        path: 'editor',
        name: 'editor',
        component: resolve => require(['../views/MonacoEditorView.vue'], resolve),
      },
      {
        path: 'table',
        name: 'table',
        component: resolve => require(['../views/EditableTable.vue'], resolve),
      }
    ]
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
  routes: routes
})

export default router
