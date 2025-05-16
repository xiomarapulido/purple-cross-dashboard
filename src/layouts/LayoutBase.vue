<template>
  <div>
    <Navbar />
    <main class="container my-4">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
/* Puedes agregar estilos específicos si es necesario, pero Bootstrap se encarga casi todo */
</style>
