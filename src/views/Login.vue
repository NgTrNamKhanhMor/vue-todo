<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid class="d-flex justify-center">
    <v-card min-width="500" class="pa-4 mt-10">
      <v-card-title class="headline text-center">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="loginUser">
          <v-text-field v-model="email" label="Email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
          <v-btn 
            type="submit" 
            color="primary" 
            block 
            :loading="loading" 
            :disabled="loading"
          >
            Login
          </v-btn>
          <v-alert v-if="error" type="error" outlined class="mt-3">{{ error }}</v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false); 
const authStore = useAuthStore();
const router = useRouter();

const loginUser = async () => {
  loading.value = true;
  error.value = null;

  const success = await authStore.login(email.value, password.value);
  loading.value = false;

  if (success) {
    router.push('/');
  } else {
    error.value = 'Invalid email or password';
  }
};
</script>


<style scoped>
.v-card-title {
  padding-bottom: 0;
}
</style>
