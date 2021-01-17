<template>
  <footer class="footer">
    <div class="container">
      <nav class="level has-text-left is-mobile">
        <div class="level-item">
          <div class="menu">
            <p class="menu-label">TritonSearch</p>

            <ul class="menu-list">
              <li><router-link to="about">About</router-link></li>
              <li><router-link to="feedback">Feedback</router-link></li>
            </ul>
          </div>
        </div>

        <div class="level-item">
          <div class="menu">
            <p class="menu-label">Resources</p>

            <ul class="menu-list">
              <li><a href="https://www.youtube.com/codinggarden/">CodingGarden</a></li>
              <li><a href="https://www.youtube.com/thecodingtrain/">CodingTrain</a></li>
            </ul>
          </div>
        </div>

        <div class="level-item">
          <div class="menu">
            <p class="menu-label">Socials</p>

            <ul class="menu-list">
              <li><a href="https://github.com/jac237/">GitHub</a></li>
              <li><a href="https://linkedin.com/in/jessieacruz/">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style lang="scss" scoped>
.menu-label {
  font-size: 16px;
  font-weight: bolder;
  color: dimgray;
}

.menu-list a {
  padding: 0.25em 1em 0.25rem 0em;
  font-size: 17px;
}
</style>
