<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Todo</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form$" v-model="formValid" @submit.prevent="handleEditTodo">
          <v-text-field
            v-model="formData.name"
            label="Name"
            placeholder="Name"
            :rules="nameRules"
          />

          <v-date-picker
            v-model="formData.date"
            label="Date"
            placeholder="Date"
            :rules="['required']"
            format="yyyy-MM-dd"
            display-format="MMMM Do, YYYY"
            required
          />

          <!-- Error Message Display -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>
          <div class="actions">
            <v-row class="d-flex justify-end ">
              <v-btn color="secondary" @click="handleCancel"  :disabled="loading" class="mr-2">Cancel</v-btn>
              <v-btn color="primary" type="submit"  :disabled="loading" class="mr-2">Edit Todo</v-btn>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { updateTodo } from '@/queries/todo'
import { ref, watch } from 'vue'

const props = defineProps({
  refetch: {
    type: Function,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
  selectedTodo: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:show'])
const form$ = ref(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const formValid = ref(false)

const formData = ref({
  name: props.selectedTodo.name || '',
  date: props.selectedTodo.date ? new Date(props.selectedTodo.date) : null, 
})


const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length >= 3) || 'Name must be at least 3 characters long',
]

const handleEditTodo = async () => {
  if (!formValid.value) return 
  const data = formData.value
  try {
    loading.value = true
    errorMessage.value = null

    await updateTodo(props.selectedTodo.id, data)

    props.refetch()
    handleCancel()
  } catch (error) {
    errorMessage.value = 'There was an error editing the todo. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:show', false)
}

watch(
  () => props.selectedTodo,
  (newTodo) => {
    formData.value = {
      name: newTodo.name || '',
      date: newTodo.date ? new Date(newTodo.date) : null, 
    }
  },
  { immediate: true },
)

watch(
  () => props.show,
  (newVal) => {
    emit('update:show', newVal)
  },
)
</script>

<style scoped></style>
