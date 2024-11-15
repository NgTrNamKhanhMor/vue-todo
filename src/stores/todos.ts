import { defineStore } from 'pinia'
import {
  useMutation,
} from '@tanstack/vue-query'
import axios from 'axios'

interface Todo {
  id: number
  userId: number
  name: string
  date: string
  completed: boolean
}

interface FilterParams {
  userId: number;
  page: number
  search: string
  date: string
  itemsPerPage: number
}

interface FilteredTodosResponse {
  todos: Todo[]
  totalPages: number
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
  }),
  actions: {
    async fetchTodos({ userId, page, search, date, itemsPerPage }: FilterParams) {
        // Fetch data from the API
        const response = await axios.get<Todo[]>(
          `https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo`
        );

        // Step 1: Filter by userId
        const todos = response.data;

        // Step 2: Apply additional filters (search, date, pagination)
        return filterTodos(todos, { userId, search, date, itemsPerPage, page })
      },

    async addTodo(newTodo: Todo) {
      return useMutation<Todo, Error, Todo>(async () => {
        const response = await axios.post<Todo>(
          `https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo`,
          newTodo,
        )
        return response.data
      })
    },

    async deleteTodo(id: number) {
      return useMutation<void, Error, number>(async () => {
        await axios.delete(`https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo/${id}`)
      })
    },

    async updateTodo(id: number, updatedData: Partial<Todo>) {
      return useMutation<Todo, Error, Partial<Todo>>(async () => {
        const response = await axios.put<Todo>(
          `https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo/${id}`,
          updatedData,
        )
        return response.data
      })
    },
  },
})

function filterTodos(
  todos: Todo[],
  { userId , search, date, itemsPerPage, page }: FilterParams,
): FilteredTodosResponse {
  let filteredTodos =  todos.filter((todo) => todo.userId === userId)
  // Step 2: Filter by search term if provided
  if (search) {
    const searchLower = search.toLowerCase()
    filteredTodos = todos.filter((todo) => todo.name.toLowerCase().includes(searchLower))
  }

  // Step 3: Filter by date if provided
  if (date) {
    filteredTodos = filteredTodos.filter((todo) => {
      const todoDate = new Date(todo.date)
      const selectedDate = new Date(date)

      return (
        todoDate.getFullYear() === selectedDate.getFullYear() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getDate() === selectedDate.getDate()
      )
    })
  }

  // Step 4: Pagination
  const totalItems = filteredTodos.length
  const start = (page - 1) * itemsPerPage
  const paginatedTodos = filteredTodos.slice(start, start + itemsPerPage)

  return {
    todos: paginatedTodos,
    totalPages: Math.ceil(totalItems / itemsPerPage),
  }
}
