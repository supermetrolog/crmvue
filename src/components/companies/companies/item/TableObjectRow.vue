<template>
  <tr class="TableObjectRow">
    <td></td>
    <td colspan="2">
      <CompanyTableObjectItem :object="object" :col="'col-12'" />
    </td>
    <td colspan="3"><div></div></td>
    <td class="text-warning CompanyTableItem-notif">
      <div>{{ attention ? "Объект давно не обновляли!" : "" }}</div>
    </td>
    <td class="date text-center">
      <div>{{ formattedDate }}</div>
    </td>
  </tr>
</template>

<script>
import moment from "moment";
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
      default: false,
    },
  },
  computed: {
    formattedDate() {
      let date = new Date(this.object.last_update * 1000);
      if (!date) {
        return "Нет данных";
      }
      return moment(date).format("DD.MM.YYYY");
    },
  },
};
</script>

<style>
</style>