<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Todo</span>
      </v-card-title>
      <v-card-text>
        <Vueform
          :endpoint="false"
          @submit="handleEditTodo"
          validate-on=""
          ref="form$"
          :display-errors="false"
        >
          <TextElement
            name="name"
            label="Name"
            placeholder="Name"
            :rules="['required']"
            :default="initialValue.name"
          />

          <DateElement
            name="date"
            placeholder="Date"
            field-name="Date"
            :default="initialValue.date"
            :rules="['required']"
            display-format="MMMM Do, YYYY"
          />
          <GroupElement name="actions">
            <ButtonElement
              align="right"
              secondary
              :resets="true"
              name="close"
              :disabled="loading"
              @click="handleCancel"
              :columns="{
                default: 12,
                sm: 9,
              }"
            >Cancel</ButtonElement>
            <ButtonElement
              align="right"
              name="submit"
              full
              :submits="true"
              button-label="Edit Todo"
              size="lg"
              :columns="{
                default: 12,
                sm: 3,
              }"
              :loading="loading"
              :disabled="loading"
            />
          </GroupElement>
        </Vueform>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateTodo } from '@/queries/todo'

const form$ = ref(null)
const loading = ref(false) 

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

const initialValue = ref({
  name: props.selectedTodo.name || '',
  date: props.selectedTodo.date
    ? new Date(props.selectedTodo.date).toISOString().split('T')[0]
    : '',
})

watch(
  () => props.selectedTodo,
  (newTodo) => {
    initialValue.value = {
      name: newTodo.name || '',
      date: newTodo.date ? new Date(newTodo.date).toISOString().split('T')[0] : '',
    }
  },
  { immediate: true },
)

const handleEditTodo = async () => {
  const data = form$.value.data
  try {
    loading.value = true
    
    await updateTodo(props.selectedTodo.id, data)
    
    props.refetch()
    handleCancel()

  } catch (error) {
    console.error('Error editing todo:', error)
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

<style scoped></style>
