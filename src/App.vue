<template>
  <v-app>
    <v-app-bar v-if="isAuthenticated" app color="primary" light>
      <v-toolbar-title >My Todo App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" >Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);


const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
</style>
