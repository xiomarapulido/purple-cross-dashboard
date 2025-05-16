<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">Purple Cross Ltd</a>
      
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item me-2">
            <span class="text-light small">Logged in as</span>
          </li>
          <li class="nav-item">
            <span class="badge bg-warning text-dark fw-semibold">John Doe</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup></script>

<style scoped>
.navbar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
