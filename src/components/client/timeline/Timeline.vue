<template>
  <div class="container-timeline">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
    />
    <div
      v-for="(items, index) in this.TIMELINE"
      :key="index"
      class="timeline"
      :class="{ branch: index > 0 }"
    >
      <TimelineItem
        v-for="(item, idx) in items"
        :key="item.id"
        :data="item"
        :idx="idx"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TimelineItem from "./TimelineItem";
export default {
  name: "Timeline",
  components: {
    TimelineItem,
  },
  computed: {
    ...mapGetters(["TIMELINE"]),
  },
  methods: {
    ...mapActions(["FETCH_TIMELINE"]),
  },
  async mounted() {
    this.FETCH_TIMELINE();
    console.log(this.TIMELINE);
  },
};
</script>

<style>
</style>