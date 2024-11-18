<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel" persistent>
    <v-card class="dialog-card">
      <v-card-title>
        <span class="headline">Add Todo</span>
      </v-card-title>
      <v-card-text>
        <Vueform
          :endpoint="false"
          @submit="handleAddTodo"
          validate-on=""
          ref="form$"
          :display-errors="false"
        >
          <TextElement name="name" label="Name" placeholder="Name" :rules="['required']" />

          <!-- Date Picker Component -->
          <DateElement
            name="date"
            placeholder="Date"
            field-name="Date"
            :rules="['required']"
            display-format="MMMM Do, YYYY"
          />

          <!-- Error Message Display -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>

          <GroupElement name="actions">
            <ButtonElement
              align="right"
              secondary
              :resets="true"
              name="close"
              @click="handleCancel"
              :disabled="loading"
              :columns="{
                default: 12,
                sm: 8,
              }"
              >Cancel</ButtonElement
            >
            <ButtonElement
              align="right"
              name="submit"
              full
              :submits="true"
              button-label="Add Todo"
              size="lg"
              :columns="{
                default: 12,
                sm: 4,
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
import { addTodo } from '@/queries/todo'

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
const form$ = ref(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const emit = defineEmits(['update:show'])

const handleAddTodo = async () => {
  if (!form$.value) {
    return
  }
  const data = form$.value.data
  try {
    loading.value = true
    errorMessage.value = null
    await addTodo(data)
    props.refetch()
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

watch(
  () => props.show,
  (newVal) => {
    emit('update:show', newVal)
  },
)
</script>

<style scoped>
.dialog-card {
  overflow: visible !important;
}
</style>
