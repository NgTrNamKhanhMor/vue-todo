import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  password: string
}
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.get<User[]>(
          'https://66d963034ad2f6b8ed546b61.mockapi.io/api/users',
        )
        const users = response.data

        // Find a user that matches the given email and password
        const user = users.find((u) => u.email === email && u.password === password)

        if (user) {
          this.user = user
          return true
        } else {
          console.error('Invalid email or password')
          return false // Indicate login failure
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        return false // Indicate login failure due to an error
      }
    },
    logout() {
      this.user = null
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
})
