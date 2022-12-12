import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from 'store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'menu',
    component: () => import('views/menu-view/index.vue'),
    async beforeEnter(to, from, next) {
      store.commit('loader', true)
      await store.dispatch('menu/getMenu');
      next()
      store.commit('loader', false)
    },
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('views/editor-view/index.vue'),
    async beforeEnter(to, from, next) {
      store.commit('loader', true)
      if (!store.getters['inited']) {
        await store.dispatch('init')
      }
      await store.getters['user/loaded']
      if (store.getters['user/auth']) {
        await store.dispatch('editor/getDishesList');
        next()
      } else {
        next({ name: 'login' })
      }
      store.commit('loader', false)
    },
  },
  {
    path: '/auth',
    name: 'auth',
    redirect: { name: 'register' },
    component: () => import('views/auth-view/index.vue'),
    async beforeEnter(to, from, next) {
      store.commit('loader', true)
      if (!store.getters['inited']){
        await store.dispatch('init')
      }
      if (store.getters['user/auth']) {
        next({ name: 'editor' })
      } else {
        next()
      }
      store.commit('loader', false)
    },
    children: [
      {
        path: '/register',
        name: 'register',
        component: () => import('components/auth/index.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('components/auth/index.vue')
      },
    ]
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
