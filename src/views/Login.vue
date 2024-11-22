<template>
  <v-container
    fluid
    class="d-flex justify-center align-center full-screen"
    style="background-color: black"
  >
    <v-card
      class="pa-4 d-flex flex-row"
      style="width: 70%; background-color: white; border-radius: 16px"
    >
      <!-- Graphic Section -->
      <div
        class="graphic-section"
        style="
          flex: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f4f4f4;
          border-radius: 16px 0 0 16px;
          overflow: hidden;
        "
      >
        <img src="/login.png" alt="Graphic" style="width: 100%; height: 100%; object-fit: cover" />
      </div>

      <!-- Form Section -->
      <div
        class="form-section d-flex flex-column justify-center"
        style="flex: 3; padding: 50px 24px; margin: 50px 0 ;text-align: center;"
      >
        <!-- Heading with Icon -->
        <div class="mb-4">
          <v-icon size="x-large" color="black" class="my-10">mdi-dropbox</v-icon>
          <h2 style="font-weight: bold;">Welcome Back</h2>
          <p class="text-muted" style="margin: 0; font-size: 16px;">Enter your information to continue</p>
        </div>

        <!-- Form -->
        <v-card-text>
          <v-form @submit.prevent="loginUser">
            <v-text-field v-model="email" label="Email" required />
            <v-text-field v-model="password" label="Password" type="password" required />

            <v-btn
              type="submit"
              block
              style="background-color: black; color: white; height: 48px; border-radius: 24px;"
              :loading="loading"
              :disabled="loading"
            >
              Login
            </v-btn>

            <v-alert v-if="error" type="error" outlined class="mt-3">{{ error }}</v-alert>
          </v-form>
        </v-card-text>

        <!-- Forgot Password & Sign Up Links -->
        <div class="mt-4">
          <p style="margin: 0;">
            <a href="/forgot-password" style="text-decoration: underline; color: #2196f3;">Forgot Password?</a>
          </p>
          <p style="margin: 0; margin-top: 8px;">
            Don't have an account?
            <a href="/sign-up" style="text-decoration: underline; color: #2196f3;">Sign Up</a>
          </p>
        </div>
      </div>
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
.full-screen {
  height: 100vh;
}

.v-card-title {
  padding-bottom: 0;
}
</style>
