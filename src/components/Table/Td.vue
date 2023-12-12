<template>
  <td :class="{ sortable: sort_asc || sort_desc, sort_asc, sort_desc }">
    <slot />
  </td>
</template>

<script>
import TableMixin from "./mixins.js";
export default {
  mixins: [TableMixin],
  name: "Td",
};
</script>

<style>
</style>