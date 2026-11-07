import { createRouter, createWebHistory } from 'vue-router'

import MessagesDaddy from '../views/MessageDaddyView.vue'
import Photos from '../views/PhotosView.vue'
import Login from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    //component: Customers
  },
  {
    path: '/message-daddy',
    name: 'mensagem-papa',
    component: MessagesDaddy
  },
  {
    path: '/albums',
    name: 'album',
    component: Photos
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.name !== 'login' && !localStorage.getItem('beaver_token')) {
    return { name: 'login' }
  }

  if (to.name === 'login' && localStorage.getItem('beaver_token')) {
    return { name: 'home' }
  }
})

export default router
