<template>
  <div class="v-sidebar">
    <main class="sidebar">
      <div class="sidebar__user-image">
        <a href="#" class="link">
          <div class="image-circle">
            <img
              src="../../../../assets/image/6.jpg"
              alt="USER IMAGE"
              class="img-center"
            />
          </div>
          <hr />
        </a>
      </div>
      <vNav />
    </main>
  </div>
</template>

<script>
import vNav from "./v-nav";
export default {
  name: "v-sidebar",
  components: {
    vNav,
  },
};
</script>