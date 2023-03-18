<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <YmapView />
  </div>
</template>

<script>
import YmapView from "@/components/common/YmapWithSelection.vue";
export default {
  name: "Calendar",
  components: {
    YmapView,
  },
  mounted() {},
};
</script>
