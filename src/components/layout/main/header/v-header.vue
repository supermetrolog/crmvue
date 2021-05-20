<template>
  <div class="v-header">
    <main class="navbar">
      <div class="container-fluid">
        <div class="row no-gutters">
          <vNav />
          <vNavNotif />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import vNav from "./v-nav";
import vNavNotif from "./v-nav-notif";
export default {
  name: "v-header",
  components: {
    vNav,
    vNavNotif,
  },
};
</script>

<style>
</style>