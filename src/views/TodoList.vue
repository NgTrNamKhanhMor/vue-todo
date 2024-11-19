<template>
  <v-container :fluid="true" class="pa-10 w-lg-75">
    <!-- Filter Badges -->
    <v-row dense align="center" class="mb-2">
      <v-col cols="auto" v-if="searchTerm">
        <v-chip color="primary" outlined  prepend-icon="mdi-star">
          Name: {{ searchTerm }}
          <v-icon small @click="clearNameFilter">mdi-close</v-icon>
        </v-chip>
      </v-col>
      <v-col cols="auto" v-if="selectedDate">
        <v-chip color="red" outlined prepend-icon="mdi-calendar-range">
          Date: {{ selectedDate }}
          <v-icon small @click="clearDateFilter">mdi-close</v-icon>
        </v-chip>
      </v-col>
    </v-row>

    <!-- Search, Date Picker, and Add Todo Button -->
    <v-row dense align="center" class="my-3">
      <v-btn color="primary" class="my-4 mr-3" @click="openAddDialog" prepend-icon="mdi-plus">
        Add Todo
      </v-btn>
      <v-btn color="secondary" class="my-4" @click="openFilterDialog" prepend-icon="mdi-filter">
        Filter
      </v-btn>
    </v-row>

    <!-- Filter Tabs -->
    <v-tabs class="my-4">
      <v-tab @click="completed = null">All</v-tab>
      <v-divider vertical class="mx-2"></v-divider>
      <v-tab @click="completed = true"> Done </v-tab>
      <v-tab @click="completed = false"> Not Done </v-tab>
    </v-tabs>

    <!-- Divider -->

    <!-- Loading and Error Handling -->
    <v-box fluid v-if="isLoading">
      <v-list>
        <v-list-item class="todo-item px-0" v-for="i in DEFAULT_PER_PAGE" :key="i">
          <v-row class="w-100 align-center">
            <!-- Main content skeleton loader taking up the remaining space -->
            <v-col class="flex-grow-1">
              <v-skeleton-loader type="list-item-avatar-two-line" :loading="isLoading" />
            </v-col>

            <!-- Avatar skeleton loader aligned to the end -->
            <v-col class="d-flex justify-end pr-0" cols="auto">
              <v-skeleton-loader type="avatar" :loading="isLoading" />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-box>

    <v-alert v-if="isError" type="error" dismissible>
      An error occurred while fetching todos.
    </v-alert>

    <!-- Todo List -->
    <v-list v-else-if="!isLoading && filteredTodos.length > 0">
      <v-list-item v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <v-row align="center">
          <v-col cols="auto">
            <v-checkbox
              @click="toggleComplete(todo)"
              v-model="todo.completed"
              color="primary"
              hide-details
            ></v-checkbox>
          </v-col>
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
          <v-col cols="auto">
            <v-btn
              size="small"
              variant="outlined"
              icon="mdi-close"
              color="red"
              @click="confirmDelete(todo.id)"
            ></v-btn>
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
    <FilterDialog v-if="filterDialog" :show="filterDialog" @update:show="filterDialog = $event" />
  </v-container>
</template>

<script setup lang="ts">
import AddTodoDialog from '@/components/AddTodoDialog.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import EditTodoDialog from '@/components/EditTodoForm.vue'
import FilterDialog from '@/components/FilterDialog.vue'
import { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE } from '@/const'
import { getTodo, updateTodo, type FilteredTodosResponse, type Todo } from '@/queries/todo'
import { useAuthStore } from '@/stores/auth'
import '@vuepic/vue-datepicker/dist/main.css'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
const completed = ref<boolean | null>(null)
const data = ref<FilteredTodosResponse | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const filterDialog = ref(false)

const queryParams = computed(() => ({
  userId: Number(authStore.user?.id),
  search: searchTerm.value,
  date: selectedDate.value || '',
  completed: completed.value === null ? null : completed.value,
  page: currentPage.value,
  itemsPerPage,
}))
const totalPages = computed(() => data.value?.totalPages || 1)
const filteredTodos = computed(() => data.value?.todos || [])
const progress = computed(() => data.value?.progress || 0)

const emit = defineEmits(['updateProgress'])

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

const openFilterDialog = () => {
  filterDialog.value = true
}

const toggleComplete = async (todo: Todo) => {
  try {
    await updateTodo(todo.id, { completed: !todo.completed })
    refetch()
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
      completed: String(completed.value),
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

const updateFilter = () => {
  updateUrlParams()
  refetch()
}

const clearNameFilter = () => {
  searchTerm.value = ''
  updateFilter()
}

const clearDateFilter = () => {
  selectedDate.value = null
  updateFilter()
}


watch(progress, (newProgress) => {
  emit('updateProgress', newProgress)
})

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
    if (route.query.completed === undefined || route.query.completed === null) {
      completed.value = null
    } else {
      completed.value =
        route.query.completed === 'true' ? true : route.query.completed === 'false' ? false : null
    }
    currentPage.value = parseInt((route.query.page as string) || '1', 10)
  },
  { immediate: true },
)

watch([currentPage, searchTerm, selectedDate, completed], () => {
  updateFilter()
})
watch([currentPage, totalPages], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  updateFilter()
})
</script>

<style scoped>
.todo-item {
  border: 1px solid #ccc;
  border-radius: 20px !important;
  margin-bottom: 8px;
  padding: 8px;
  min-height: 85px;
}
</style>
