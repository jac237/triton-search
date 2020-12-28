<template>
  <div id="app">
    <nav class="navbar is-dark pl-2 pr-2 pt-1 pb-1" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
          target="_blank"
          rel="noopener nofollow"
          title="Triton Search: Unofficial course searching app for UCSD">
            <img
              src="../public/images/icons8-shark-48.png"
              alt="Triton Search Logo Image"
              width="35px"
              height="40px">
          <div
            class="is-size-4 ml-2"
            style="font-family: 'Roboto', serif;">
            triton search
          </div>
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <a
            class="navbar-item has-text-dark"
            href="https://github.com/jac237/"
            target="_blank"
            rel="noopener nofollow"
            title="Github">
              <div style="font-size: 36px;">
                <i class="fab fa-github" style="color: white"></i>
              </div>
          </a>
          <a
            class="navbar-item has-text-dark"
            href="https://linkedin.com/in/jessieacruz/"
            target="_blank"
            rel="noopener nofollow"
            title="LinkedIn">
              <div style="font-size: 36px;">
                <i class="fab fa-linkedin" style="color: white;"></i>
              </div>
          </a>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
.navbar-item img {
  max-height: 3rem;
}
</style>
