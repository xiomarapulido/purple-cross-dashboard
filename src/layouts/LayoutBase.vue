<script setup lang="ts">
import NavbarComponent from '@/components/Navbar.vue';
import AlertMessage from '@/components/AlertMessage.vue'
import { useGlobalAlert } from '@/composables/useGlobalAlert'

const { alertVisible, alertMessage, alertType } = useGlobalAlert()
</script>

<template>
  <AlertMessage
    v-model:modelValue="alertVisible"
    :message="alertMessage"
    :type="alertType"
    :duration="3000"
  />
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- Header/Navbar -->
    <header>
      <NavbarComponent />
    </header>

    <!-- Main content area -->
    <main class="flex-grow-1 container py-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss"></style>
