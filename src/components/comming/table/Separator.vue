<template>
  <tr class="separator">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td class="separator__date">{{ date }}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <TableItem
    v-for="(comming, idx) in commings"
    :key="idx"
    :comming="comming"
    :idx="idx"
  />
</template>

<script>
import TableItem from "./TablaeItem";
export default {
  name: "Separator",
  components: {
    TableItem,
  },
  props: {
    commings: {
      type: Array,
    },
  },
  data() {
    return {
      date: this.commings[0].date,
    };
  },
};
</script>

<style>
</style>