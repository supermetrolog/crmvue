<template>
  <strong>Контакты</strong>
  <div class="CompanyBoxContactList">
    <CompanyBoxContactListItem
      @openContactFormForUpdate="this.$emit('openContactFormForUpdate')"
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
  emits: ["openContactFormForUpdate"],
};
</script>