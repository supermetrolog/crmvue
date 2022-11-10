<template>
  <tr class="TableObjectRow">
    <td></td>
    <td colspan="2">
      <CompanyTableObjectItem :object="object" :col="'col-12'" />
    </td>
    <td colspan="3"></td>
    <td class="text-warning CompanyTableItem-notif">
      {{ attention ? "Объект давно не обновляли!" : "" }}
    </td>
    <td class="date text-center">дата</td>
  </tr>
</template>

<script>
import CompanyTableObjectItem from "../../objects/company-objects/table-objects/CompanyTableObjectItem.vue";
export default {
  name: "TableObjectRow",
  components: { CompanyTableObjectItem },
  props: {
    object: {
      type: Object,
      required: true,
    },
    attention: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style>
</style>