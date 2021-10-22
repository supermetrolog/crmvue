<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <SimpleCalendar />
  </div>
</template>

<script>
import SimpleCalendar from "../components/calendar/SimpleCalendar";
export default {
  name: "Calendar",
  components: {
    SimpleCalendar,
  },
  mounted() {
    // console.log(this.$route.params.mod);
  },
};
</script>
