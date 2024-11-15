import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '@/views/Login.vue'
import TodoList from '@/views/TodoList.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: TodoList,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
