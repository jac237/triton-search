<template>
<!-- SEARCH, ADD, PRINT -->
<div class="tile is-ancestor mb-5 px-5">
  <div class="tile is-parent">
    <div class="tile is-child notification box">
      <p class="title is-capitalized is-size-4 is-family-code">1. search courses</p>
      <p class="subtitle is-size-6 mb-6">
        Select and filter courses by department.
      </p>
      <div class="icon is-large">
        <i class="fas fa-th-list fa-7x"></i>
      </div>
    </div>
    <!-- Add content or other tiles -->
  </div>
  <div class="tile is-parent">
    <div class="tile is-child notification box is-info">
      <p class="title is-capitalized is-size-4 is-family-code">2. add courses</p>
      <p class="subtitle is-size-6 mb-6">
        Add your favorite courses to the sidebar.
      </p>
      <span class="icon is-large">
        <i class="fas fa-server fa-7x"></i>
      </span>
    </div>
    <!-- Add content or other tiles -->
  </div>
  <div class="tile is-parent">
    <div class="tile is-child notification box">
      <p class="title is-capitalized is-size-4 is-family-code">3. print courses</p>
      <p class="subtitle is-size-6 mb-6">
        Print and share your favorite UCSD courses.
      </p>
      <span class="icon is-large">
        <i class="far fa-file-pdf fa-7x"></i>
      </span>
    </div>
    <!-- Add content or other tiles -->
  </div>
</div>
</template>

<script>
export default {
  name: 'Features',
};
</script>

<style lang="scss">
</style>
