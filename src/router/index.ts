import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '@/views/Login.vue'
import TodoList from '@/views/TodoList.vue'
import { HOME_PATH, LOGIN_PATH } from '@/const/path'



const routes = [
  { path: LOGIN_PATH, component: Login },
  {
    path: HOME_PATH,
    component: TodoList,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        next(LOGIN_PATH)
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
