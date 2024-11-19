<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel" persistent>
    <v-card class="dialog-card">
      <v-card-title>
        <span class="headline">Filter Todo</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form$" v-model="formValid" @submit.prevent="handleFilter">
          <!-- Name Input Field -->
          <v-text-field v-model="searchTerm" label="Name" placeholder="Name" />

          <!-- Date Picker Component -->
          <v-date-picker
            v-model="selectedDate"
            label="Date"
            placeholder="Date"
            display-format="MMMM Do, YYYY"
          />

          <!-- Clear Icon Button -->
          <v-btn icon @click="clearDate" :disabled="loading">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <!-- Error Message Display -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>

          <!-- Actions Buttons -->
          <v-row>
            <v-col cols="12" sm="8">
              <v-btn @click="handleCancel" :loading="loading" :disabled="loading" full
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn type="submit" :loading="loading" :disabled="loading" full>Submit</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { format, parse } from 'date-fns'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const form$ = ref(null)
const formValid = ref(false)
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const searchTerm = ref('')
const selectedDate = ref<Date | null>(null)

const emit = defineEmits(['update:show'])

const handleFilter = async () => {
  if (!formValid.value) {
    return
  }

  const data = { name: searchTerm.value, date: selectedDate.value }

  try {
    loading.value = true
    errorMessage.value = null
    const formattedDate = selectedDate.value ? format(selectedDate.value, 'MMM dd, yyyy') : ''
    router.push({
      query: {
        ...route.query,
        search: data.name,
        date: formattedDate,
        completed: null,
        page: 1,
      },
    })
    handleCancel()
  } catch (error) {
    errorMessage.value = 'There was an error adding the todo. Please try again.'
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:show', false)
}

const clearDate = () => {
  selectedDate.value = null
}

watch(
  () => props.show,
  (newVal) => {
    emit('update:show', newVal)
  },
)

watch(
  () => route.query,
  () => {
    searchTerm.value = (route.query.search as string) || ''
    selectedDate.value = route.query.date
      ? parse(route.query.date as string, 'MMM dd, yyyy', new Date()) // Convert string to Date
      : null
  },
  { immediate: true },
)
</script>

<style scoped>
.dialog-card {
  overflow: visible !important;
}
</style>
