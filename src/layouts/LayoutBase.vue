<script setup lang="ts">
import NavbarComponent from '@/components/Navbar.vue';
</script>

<template>
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
