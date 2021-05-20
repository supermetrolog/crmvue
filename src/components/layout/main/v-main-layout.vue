<template>
  <div class="v-main-layout">
    <vSideBar />
    <vHeader />
    <section class="content">
      <router-view />
    </section>
  </div>
</template>

<script>
import vHeader from "./header/v-header";
import vSideBar from "./sidebar/v-sidebar";
export default {
  name: "v-main-layout",
  components: {
    vHeader,
    vSideBar,
  },
  props: {
    message: {
      type: String,
      default: "FUCK THE POLICE",
    },
  },
};
</script>
