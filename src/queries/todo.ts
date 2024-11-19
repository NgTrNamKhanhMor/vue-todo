import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export interface Todo {
  id: number
  userId: number
  name: string
  date: string | null
  completed: boolean
}

interface FilterParams {
  userId: number
  page: number
  search: string
  completed: boolean | null
  date: string
  itemsPerPage: number
}

export interface FilteredTodosResponse {
  progress: number,
  todos: Todo[]
  totalPages: number
}

// Filter function (helper)
export function filterTodos(
  todos: Todo[],
  { userId, search, date, completed, itemsPerPage, page }: FilterParams,
): FilteredTodosResponse {
  let filteredTodos = todos.filter((todo) => todo.userId === userId)

  const totalTodos = filteredTodos.length
  const completedTodos = filteredTodos.filter((todo) => todo.completed).length
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0
  // Search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredTodos = filteredTodos.filter((todo) => todo.name.toLowerCase().includes(searchLower))
  }
  if (completed !== null) {
    filteredTodos = filteredTodos.filter((todo) => todo.completed === completed)
  }
  // Date filter
  if (date) {
    const selectedDate = new Date(date)
    filteredTodos = filteredTodos.filter((todo) => {
      const todoDate = new Date(todo.date)
      return (
        todoDate.getFullYear() === selectedDate.getFullYear() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getDate() === selectedDate.getDate()
      )
    })
  }

  // Pagination
  const totalItems = filteredTodos.length
  const start = (page - 1) * itemsPerPage
  const paginatedTodos = filteredTodos.slice(start, start + itemsPerPage)

  return {
    progress,
    todos: paginatedTodos,
    totalPages: Math.ceil(totalItems / itemsPerPage),
  }
}

export async function getTodo(queryParams: FilterParams): Promise<FilteredTodosResponse> {
  const response = await axios.get('https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo')
  return filterTodos(response.data, queryParams)
}

// Add Todo
export async function addTodo(newTodo: Todo): Promise<Todo> {
  const authStore = useAuthStore()
  const response = await axios.post<Todo>(`https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo`, {
    ...newTodo,
    userId: Number(authStore.user?.id),
  })
  return response.data
}

// Delete Todo
export async function deleteTodo(id: number): Promise<void> {
  await axios.delete(`https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo/${id}`)
}

// Update Todo
export async function updateTodo(id: number, updatedData: Partial<Todo>): Promise<Todo> {
  const response = await axios.put<Todo>(
    `https://66d963034ad2f6b8ed546b61.mockapi.io/api/todo/${id}`,
    updatedData,
  )
  return response.data
}
