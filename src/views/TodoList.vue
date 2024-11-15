<template>
  <v-container :fluid="true">
    <!-- Search and Date Picker -->
    <v-row dense align="center">
      <v-col cols="3">
        <v-text-field v-model="searchTerm" label="Search Todos" />
      </v-col>
      <v-col cols="3">
        <VueDatePicker v-model="selectedDate" :enable-time-picker="false" position="left"/>
      </v-col>
    </v-row>
    <v-btn color="primary" @click="openAddDialog">Add Todo</v-btn>

    <!-- Loading and Error Handling -->
    <v-container fluid v-if="isLoading" >
      <v-skeleton-loader
        type="table-heading"
        :loading="isLoading"
        v-for="i in 5"
        class="py-3"
        :key="i"
      />
    </v-container>
    <v-alert v-if="isError" type="error" dismissible>
      An error occurred while fetching todos.
    </v-alert>

    <!-- Todo List: Show only if not loading -->
    <v-list v-else-if="!isLoading && filteredTodos.length > 0">
      <v-list-item v-for="todo in filteredTodos" :key="todo.id">
        <v-row align="center">
          <!-- Checkbox on the left -->
          <v-col cols="auto">
            <v-checkbox
              @click="toggleComplete(todo)"
              v-model="todo.completed"
              color="primary"
              hide-details
            ></v-checkbox>
          </v-col>

          <!-- Title and Subtitle in another column -->
          <v-col class="cursor-pointer" @click="() => openEditDialog(todo)">
            <v-list-item-title>
              {{ todo.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{
                new Date(todo.date).toLocaleDateString('en-US', {
                  timeZone: 'UTC',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            </v-list-item-subtitle>
          </v-col>

          <!-- Delete Icon -->
          <v-col cols="auto">
            <v-icon icon="mdi-delete" color="red" @click="confirmDelete(todo.id)"></v-icon>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <!-- No Todos Message -->
    <v-alert
      v-else-if="!isLoading && filteredTodos.length === 0"
      type="info"
      variant="plain"
      dismissible
    >
      No todos found.
    </v-alert>

    <!-- Pagination -->
    <v-pagination v-model="currentPage" :length="totalPages" />

    <!-- Add Todo, Delete and Edit Todo Dialogs -->
    <AddTodoDialog
      v-if="addDialog"
      :show="addDialog"
      @update:show="addDialog = $event"
      :refetch="refetch"
    />
    <EditTodoDialog
      v-if="selectedTodo"
      :show="editDialog"
      @update:show="editDialog = $event"
      :refetch="refetch"
      :selectedTodo="selectedTodo"
    />
    <DeleteDialog
      v-if="confirmDeleteDialog"
      :show="confirmDeleteDialog"
      @update:show="confirmDeleteDialog = $event"
      :refetch="refetch"
      :todoToDelete="todoToDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddTodoDialog from '@/components/AddTodoDialog.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import EditTodoDialog from '@/components/EditTodoForm.vue'
import { getTodo, updateTodo, type FilteredTodosResponse, type Todo } from '@/queries/todo'
import { useAuthStore } from '@/stores/auth'
import VueDatePicker from '@vuepic/vue-datepicker'
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from '@/const'
import '@vuepic/vue-datepicker/dist/main.css'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const selectedTodo = ref<Todo | null>(null)
const addDialog = ref(false)
const editDialog = ref(false)
const confirmDeleteDialog = ref(false)
const todoToDelete = ref<number | undefined>(undefined)
const currentPage = ref(DEFAULT_CURRENT_PAGE)
const itemsPerPage = DEFAULT_PER_PAGE
const searchTerm = ref('')
const selectedDate = ref<string | null>(null)
const data = ref<FilteredTodosResponse | null>(null)
const isLoading = ref(false)
const isError = ref(false)

const queryParams = computed(() => ({
  userId: Number(authStore.user?.id),
  search: searchTerm.value,
  date: selectedDate.value || '',
  page: currentPage.value,
  itemsPerPage,
}))
const totalPages = computed(() => data.value?.totalPages || 1)
const filteredTodos = computed(() => data.value?.todos || [])


const refetch = async () => {
  isLoading.value = true
  isError.value = false
  try {
    data.value = await getTodo(queryParams.value)
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const toggleComplete = async (todo: Todo) => {
  try {
    await updateTodo(todo.id, { completed: !todo.completed })
  } catch (error) {
    isError.value = true
  }
}

const updateUrlParams = () => {
  router.push({
    query: {
      ...route.query,
      search: searchTerm.value,
      date: selectedDate.value,
      page: currentPage.value.toString(),
    },
  })
}

const openAddDialog = () => {
  addDialog.value = true
}

const openEditDialog = (todo: Todo) => {
  selectedTodo.value = todo
  editDialog.value = true
}

const confirmDelete = (todoId: number) => {
  todoToDelete.value = todoId
  confirmDeleteDialog.value = true
}

watch(
  queryParams,
  () => {
    refetch()
  },
  { immediate: true },
)

watch(
  () => route.query,
  () => {
    searchTerm.value = (route.query.search as string) || ''
    selectedDate.value = (route.query.date as string) || ''
    currentPage.value = parseInt((route.query.page as string) || '1', 10)
  },
  { immediate: true },
)

watch([currentPage, searchTerm, selectedDate], () => {
  updateUrlParams()
  refetch()
})
watch([currentPage, totalPages], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  updateUrlParams()
  refetch()
})

</script>

<style scoped></style>
