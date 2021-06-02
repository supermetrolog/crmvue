<template>
  <h1>ALL</h1>
  <!-- <Table /> -->
  <!-- <button class="btn btn-danger">Danger</button>
  <button class="btn btn-success">Success</button>
  <button class="btn btn-warning">Warning</button>
  <button class="btn btn-info">Info</button>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-dark">Dark</button> -->
  <div class="row no-gutters">
    <div class="col-12">
      <Timeline />
    </div>
  </div>
</template>

<script>
// import Table from "../components/client/table/Table";
import Timeline from "../../components/client/timeline/Timeline";
export default {
  name: "All",
  components: {
    // Table,
    Timeline,
  },
};
</script>

<style>
</style>