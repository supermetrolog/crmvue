<template>
  <strong>Контакты</strong>
  <div class="CompanyBoxContactList">
    <CompanyBoxContactListItem
      v-for="contact in contacts"
      :key="contact.id"
      :contact="contact"
    />
  </div>
</template>

<script>
import CompanyBoxContactListItem from "./CompanyBoxContactListItem.vue";
export default {
  name: "CompanyBoxContactList",
  props: {
    contacts: {
      type: Array,
      required: true,
    },
  },
  components: {
    CompanyBoxContactListItem,
  },
};
</script>