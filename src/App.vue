<template>
  <v-app>
    <!-- Header Section -->
    <v-app-bar v-if="isAuthenticated" app color="accent" elevate-on-scroll>
      <!-- Header Section -->
      <v-container fluid class="px-10 w-lg-75">
        <v-row align="center" justify="space-between" class="w-100">
          <v-col cols="auto">
            <div>
              <h1 class="display-1 mb-0 white--text">Todo</h1>
            </div>
          </v-col>

          <!-- Progress Bar Section -->
          <v-row align="center" justify="center">
            <v-col cols="12">
              <div class="d-flex align-center d-flex justify-center align-center">
                <span class="mr-4 white--text">Your progress</span>
                <v-progress-linear
                  :model-value="progress"
                  height="10"
                  color="primary"
                  rounded
                  class="w-50"
                ></v-progress-linear>
              </div>
            </v-col>
          </v-row>

          <!-- Logout Button Section -->
          <v-col cols="auto">
            <v-btn variant="outlined" class="my-0 white--text" icon="mdi-logout" @click="logout">
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view @updateProgress="handleProgressUpdate" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const progress = ref(0)

const handleProgressUpdate = (data) => {
  progress.value = data
}

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style></style>
