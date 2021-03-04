<template>
  <nav
    class="navbar is-dark pl-2 pr-2 pt-1 pb-1"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item"
        href="/"
        title="Triton Search: UCSD Course Searching"
      >
        <img
          src="../../public/images/triton-search-small.png"
          alt="Triton Search Logo Image"
          width="35px"
          height="40px"
        />
        <div class="is-size-4 ml-2" style="font-family: 'Roboto', serif">
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
          title="Github"
        >
          <div style="font-size: 28px">
            <i class="fab fa-github" style="color: white"></i>
          </div>
        </a>
        <a
          class="navbar-item has-text-dark"
          href="https://linkedin.com/in/jessieacruz/"
          target="_blank"
          rel="noopener nofollow"
          title="LinkedIn"
        >
          <div style="font-size: 28px">
            <i class="fab fa-linkedin" style="color: white"></i>
          </div>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style></style>
