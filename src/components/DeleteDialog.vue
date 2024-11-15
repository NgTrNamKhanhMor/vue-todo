<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel">
    <v-card>
      <v-card-title>
        <span class="headline">Confirm Delete</span>
      </v-card-title>
      <v-card-text> Are you sure you want to delete this todo? </v-card-text>
      <v-card-actions>
        <v-btn @click="handleCancel" :disabled="loading">Cancel</v-btn>
        <v-btn
          color="red"
          @click="handleDelete"
          :loading="loading"
          :disabled="loading"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { deleteTodo } from '@/queries/todo'

const props = defineProps({
  refetch: {
    type: Function,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
  todoToDelete: {
    type: Number,
    required: true,
  },
})

const todoId = props.todoToDelete
const loading = ref(false) 

const handleDelete = async () => {
  if (!todoId) {
    return
  }

  try {
    loading.value = true
    
    await deleteTodo(todoId) 
    
    props.refetch()
    handleCancel() 

  } catch (error) {
    console.error('Error deleting todo:', error)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['update:show'])

watch(
  () => props.show,
  (newVal) => {
    emit('update:show', newVal)
  },
)

function handleCancel() {
  emit('update:show', false)
}
</script>


<style></style>
