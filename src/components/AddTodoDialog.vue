<template>
  <v-dialog :model-value="show" max-width="500" persistent>
    <v-card class="dialog-card">
      <v-card-title>
        <span class="headline">Add Todo</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="submitForm">
          <!-- Name Field -->
          <v-text-field
            v-model="name"
            label="Name"
            placeholder="Enter name"
            :rules="nameRules"
            outlined
            required
          ></v-text-field>

          <!-- Date Picker -->
          <v-date-picker
            v-model="date"
            label="Date"
            placeholder="Select date"
            outlined
            required
            width="450"
            :rules="dateRules"
            @change="validateDate"
          ></v-date-picker>

          <!-- Error Message Display -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>

          <!-- Action Buttons -->
          <div class="actions">
            <v-row class="d-flex justify-end">
              <v-btn color="secondary" variant="outlined" @click="handleCancel" class="mr-2">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="submitForm" :disabled="!formValid || loading">
                Add Todo
              </v-btn>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { addTodo } from '@/queries/todo'
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  refetch: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:show'])

// Form state

const form = ref(null)
const formValid = ref(false)
const name = ref('')
const date = ref<Date | null>(new Date())
const loading = ref(false)
const errorMessage = ref<string | null>(null)

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length >= 3) || 'Name must be at least 3 characters long',
]

const dateRules = [(v: Date | null) => !!v || 'Date is required']

const handleCancel = () => {
  emit('update:show', false)
}

const validateDate = () => {
  const isDateValid = date.value !== null && date.value !== null
  formValid.value = isDateValid && name.value.length >= 3
}

const submitForm = async () => {
  if (!formValid.value) return
  loading.value = true
  errorMessage.value = null

  try {
    await addTodo({
      name: name.value,
      date: String(date.value),
    })
    props.refetch()
    handleCancel()
  } catch (error) {
    errorMessage.value = 'There was an error adding the todo. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
