<template>
  <v-dialog :model-value="show" max-width="500" @update:model-value="handleCancel" persistent>
    <v-card class="dialog-card">
      <v-card-title>
        <span class="headline">Filter Todo</span>
      </v-card-title>
      <v-card-text>
        <Vueform
          :endpoint="false"
          @submit="handleFilter"
          validate-on=""
          ref="form$"
          :display-errors="false"
        >
          <TextElement name="name" label="Name" placeholder="Name" :default="searchTerm" />

          <!-- Date Picker Component -->
          <!-- Date Picker with v-model binding (if supported) -->
          <GroupElement name="dateGroup">
            <DateElement
              name="date"
              placeholder="Date"
              field-name="Date"
              :default="selectedDate"
              display-format="MMMM Do, YYYY"
              :columns="{
                container: 10,
                }"
            />

            <!-- Clear Icon Button -->
            <ButtonElement
              secondary
                @click="clearDate"
              name="resetDate"
              :disabled="loading"
              class="d-flex justify-center items-center"
              :columns="{
                container: 2,
                
              }"
              > 
                <v-icon >mdi-close</v-icon>
              </ButtonElement
            >
          </GroupElement>
          <!-- Error Message Display -->
          <v-alert v-if="errorMessage" type="error" dismissible>
            {{ errorMessage }}
          </v-alert>

          <GroupElement name="actions">
            <ButtonElement
              align="right"
              :resets="true"
              secondary
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
              button-label="Submit"
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
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const searchTerm = ref('')
const selectedDate = ref<string | undefined>(undefined)

const emit = defineEmits(['update:show'])

const handleFilter = async () => {
  if (!form$.value) {
    return
  }
  const data = form$.value.data
  try {
    loading.value = true
    errorMessage.value = null
    router.push({
      query: {
        ...route.query,
        search: data.name,
        date: data.date,
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
  form$.value.update({
    date: null,
  })
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
    selectedDate.value = (route.query.date as string) || ''
  },
  { immediate: true },
)
</script>

<style scoped>
.dialog-card {
  overflow: visible !important;
}
</style>
