<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm">
    <div class="col-12 wrap-navbar">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <i class="bi bi-heart-pulse-fill me-2 tex-nav icon-nav-info"></i>
          <span class="fw-bold text-light tex-nav-info">Purple Cross Ltd</span>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 text-start text-md-end">
          <i class="bi bi-person-circle me-2 icon-nav-user"></i>
          <span class="fw-bold text-light tex-nav-info">
            Welcome, Administrator
          </span>
        </div>

      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  padding: 0.625rem 1.25rem;
  background-color: var(--purple);
}

.tex-nav-info {
  font-size: 1.25rem;
}

.icon-nav-info{
  font-size: 1.375rem;
  color: var(--green-light);
}

.icon-nav-user{
  font-size: 1.375rem;
  color: var(--yellow);
}
</style>